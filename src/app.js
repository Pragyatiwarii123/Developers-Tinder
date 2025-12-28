const express = require('express');
const { connectDb } = require('./config/database');
const { UserModel } = require('./models/user');
const { validateSignUpData } = require('./utils/validation');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const { userAuth } = require('./middleware/auth');


const app = express();

//middleware to parse cookies from incoming requests
app.use(cookieParser());

//creating a middle ware to convert incoming json request to javascript object
app.use(express.json());

app.post('/signup', async (req, res) => {
    //Never Trust req.body
    validateSignUpData(req.body);
    //Creating new instance of user model

    const { firstName, lastName, emailId, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    req.body.password = hashedPassword;

    const user = new UserModel(req.body)

    try {
        await user.save();
        res.send("User created successfully")
    } catch (err) {
        res.status(500).send({ message: "Error creating user", error: err.message });
    }
});

app.post('/login', async (req, res) => {
    const { emailId, password } = req.body;
    try {

        const user = await UserModel.findOne({ emailId: emailId });

        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);

        if (!isPasswordMatch) {
            return res.status(400).send({ message: "Invalid credentials" });
        } else {
            const token = jwt.sign({ _id: user._id }, "devTinder@831$", { expiresIn: '6h' });
            res.cookie('token', token, {expires: new Date(Date.now() + 6 * 3600000)});
            res.send("Login successful");
        }

    } catch (err) {
        res.status(500).send({ message: "Error creating user", error: err.message });
    }
});


app.get('/profile', userAuth, async (req, res) => {
    try {
        const user = req.user;
        res.send(user);
    } catch (err) {
        res.status(500).send({ message: "Error fetching user", error: err.message });
    }
});


//get user by emailId

app.get('/user', async (req, res) => {
    const userEmail = req.body.emailId;
    try {
        // const user = await UserModel.find({ emailId: userEmail });
        const user = await UserModel.findOne({ emailId: userEmail });
        if (user.length === 0) {
            return res.status(404).send({ message: "User not found" });
        } else {
            res.send(user);
        }
    } catch (err) {
        res.status(500).send({ message: "Error fetching user", error: err.message });
    }
});

//send connection request

app.post('/sendConnectRequest', userAuth, async (req, res) => {
    const fromUser = req.user.firstName
    try {
        res.send({ message: fromUser + " sent a connection request" });
    } catch (err) {
        res.status(500).send({ message: "Error sending connection request", error: err.message });
    }
});

connectDb()
    .then(() => {
        console.log('Database Connected Successfully');
        app.listen(7777, () => {
            console.log('Server is running on port 7777');
        })
    }).catch((err) => {
        console.error('Database Connection Failed', err);
    });

