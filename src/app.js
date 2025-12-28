const express = require('express');
const { connectDb } = require('./config/database');
const { UserModel } = require('./models/user');
const { validateSignUpData } = require('./utils/validation');
const bcrypt = require('bcrypt');

const app = express();

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

    const {emailId, password } = req.body;

    try {

        const user = await UserModel.findOne({ emailId: emailId });

        if (!user) {
            return  res.status(404).send({ message: "User not found" });
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        
        if (!isPasswordMatch) {
            return res.status(400).send({ message: "Invalid credentials" });
        }else{
            res.send("Login successful");
        }
       
    } catch (err) {
        res.status(500).send({ message: "Error creating user", error: err.message });
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


//get all users -> feed
app.get('/feed', async (req, res) => {
    try {
        const user = await UserModel.find();
        if (user.length === 0) {
            return res.status(404).send({ message: "User not found" });
        } else {
            res.send(user);
        }
    } catch (err) {
        res.status(500).send({ message: "Error fetching user", error: err.message });
    }
});


//delete user api

app.delete('/user', async (req, res) => {
    const userId = req.body.userId;
    try {
        // const user = await UserModel.findOneAndDelete({ _id: userId });
        //shorthand for above is this 
        const user = await UserModel.findByIdAndDelete(userId);
        if (!user) {
            return res.status(404).send({ message: "User not found" });
        } else {
            res.send({ message: "User deleted successfully" });
        }
    } catch (err) {
        res.status(500).send({ message: "Error deleting user", error: err.message });
    }
})


//update user api

app.patch('/user/:userId', async (req, res) => {
    const userId = req.params?.userId;
    const data = req.body
    try {
        ALLOWED_UPDATES = ['password', 'age', 'gender', 'about', 'photoUrl', 'skills']

        isUpdateAllowed = Object.keys(data).every((key) => ALLOWED_UPDATES.includes(key))

        if (!isUpdateAllowed) {
            return res.status(400).send({ message: "Invalid updates!" })
        }

        if (data?.skills?.length > 10) {
            return res.status(400).send({ message: "Skills cannot exceed 10!" })
        }

        const user = await UserModel.findByIdAndUpdate(userId, data, { returnDocument: 'before', runValidators: true });
        console.log(user);
        if (!user) {
            return res.status(404).send({ message: "User not found" });
        } else {
            res.send("User updated successfully");
        }
    } catch (err) {
        res.status(500).send({ message: "Error updating user", error: err.message });
    }
})



connectDb()
    .then(() => {
        console.log('Database Connected Successfully');
        app.listen(7777, () => {
            console.log('Server is running on port 7777');
        })
    }).catch((err) => {
        console.error('Database Connection Failed', err);
    });

