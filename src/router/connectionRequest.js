const express = require('express');
const { userAuth } = require('../middleware/auth');


const connectionsRouter = express.Router();


connectionsRouter.post('/sendConnectRequest', userAuth, async (req, res) => {
    const fromUser = req.user.firstName
    try {
        res.send({ message: fromUser + " sent a connection request" });
    } catch (err) {
        res.status(500).send({ message: "Error sending connection request", error: err.message });
    }
});


module.exports = connectionsRouter;