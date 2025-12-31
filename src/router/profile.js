const express = require('express');
const { userAuth } = require('../middleware/auth');
const { validateProfileData } = require('../utils/validation');
const { UserModel } = require('../models/user');
const profileRouter = express.Router();



profileRouter.get('/profile/view', userAuth, async (req, res) => {
    try {
        const user = req.user;
        res.send(user);
    } catch (err) {
        res.status(500).send({ message: "Error fetching profile", error: err.message });
    }
});


profileRouter.patch('/profile/edit', userAuth, async (req, res) => {
    try {
        const isValidUpdateData = validateProfileData(req.body);
        if (!isValidUpdateData) {
            return res.status(400).send({ message: "Invalid profile data" });
        } else {

            const loggedInUser = req.user;
            Object.keys(req.body).forEach((key) => {
                loggedInUser[key] = req.body[key];
            })

            await loggedInUser.save();
            res.json({ message: "Profile updated successfully", loggedInUser });

        }
    } catch (err) {
        res.status(500).send({ message: "Error editing profile", error: err.message });
    }
});


profileRouter.patch('/profile/password', async (req, res) => {
    try {
        const { password, emailId } = req.body;
        const loggedInUser = await UserModel.findOne({ emailId: emailId });
        if (!loggedInUser) {
            return res.status(404).send({ message: "User not found" });
        }
        loggedInUser.password = req.body.password;
        await loggedInUser.save();
        res.status(200).send("Password updated successfully");
    } catch (err) {
        res.status(500).send({ message: "Error updating password", error: err.message });
    }
});


module.exports = profileRouter;
