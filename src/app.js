const express = require('express');
const { connectDb } = require('./config/database');
const { UserModel } = require('./models/user');

const app = express();

//creating a middle ware to convert incoming json request to javascript object
app.use(express.json());

app.post('/signup', async (req, res) => {
    //Creating new instance of user model
    const user = new UserModel(req.body)
    try {
        await user.save();
        res.send("User created successfully")
    } catch (err) {
        res.status(400).send({ message: "Error creating user", error: err.message });
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

