const express = require('express');
const { userAuth } = require('../middleware/auth');
const { validateProfileData } = require('../utils/validation');
const profileRouter = express.Router();



profileRouter.get('/profile/view', userAuth, async (req, res) => {
    try {
        const user = req.user;
        res.send(user);
    } catch (err) {
        res.status(500).send({ message: "Error fetching user", error: err.message });
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
            res.json({ message: "Profile updated successfully" , loggedInUser});

        }
    } catch (err) {
        res.status(500).send({ message: "Error fetching user", error: err.message });
    }
});


module.exports = profileRouter;
