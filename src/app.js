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

app.patch('/user', async (req, res) => {
    const userId = req.body.userId;
    const data = req.body
    try {
        const user = await UserModel.findByIdAndUpdate(userId, data, { returnDocument: 'before' });
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

