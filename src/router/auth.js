const express = require('express');
const { validateSignUpData } = require('../utils/validation');
const bcrypt = require('bcrypt');
const { UserModel } = require('../models/user');

const authRouter = express.Router();


authRouter.post('/signup', async (req, res) => {
    try {
        //Never Trust req.body
        validateSignUpData(req.body);
        //Creating new instance of user model

        const { firstName, lastName, emailId, password } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);

        req.body.password = hashedPassword;

        const user = new UserModel(req.body)


        await user.save();
        res.send("User created successfully")
    } catch (err) {
        res.status(500).send({ message: "Error creating user", error: err.message });
    }
});

authRouter.post('/login', async (req, res) => {
    const { emailId, password } = req.body;
    try {

        const user = await UserModel.findOne({ emailId: emailId });

        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }

        const isPasswordMatch = user.validatePassword(password)

        if (!isPasswordMatch) {
            return res.status(400).send({ message: "Invalid credentials" });
        } else {
            const token = user.getJWT();
            res.cookie('token', token, { expires: new Date(Date.now() + 6 * 3600000) });
            res.json({ message: "Login successful", data: user });
        }

    } catch (err) {
        res.status(500).send({ message: "Error creating user", error: err.message });
    }
});
authRouter.post('/logout', async (req, res) => {
    try {
        res.cookie('token', null, { expires: new Date(Date.now()) })
        res.send("Logout successful");

    } catch (err) {
        res.status(500).send({ message: "Error creating user", error: err.message });
    }
});


module.exports = authRouter;