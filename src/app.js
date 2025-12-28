const express = require('express');
const { connectDb } = require('./config/database');
const { UserModel } = require('./models/user');

const app = express();


app.post('/signup', async (req, res) => {
    //Creating new instance of user model
    const user = new UserModel({
        firstName: "pragya",
        lastName: "tiwari",
        emailId: "pragya831@gmail.com",
        password: "pragya@123",
    })

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

