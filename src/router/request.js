const express = require('express');
const { userAuth } = require('../middleware/auth');
const { ConnectionRequestModel } = require('../models/connectionRequest');
const { UserModel } = require('../models/user');
const { connection } = require('mongoose');


const requestsRouter = express.Router();


requestsRouter.post('/request/send/:status/:toUserId', userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const fromUserId = loggedInUser._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;

        const allowedStatuses = ['interested', 'ignored'];

        if (!allowedStatuses.includes(status)) {
            return res.status(400).send({ message: "Invalid status" });
        }

        const toUser = await UserModel.findOne({ _id: toUserId });
        if (!toUser) {
            return res.status(404).send({ message: "User not found!!!" });
        }

        if (toUserId == fromUserId) {
            return res.status(400).send({ message: "You cannot send request to yourself" });
        }

       // if connection request alredy pending either from sender or receiver

        const existingRequest = await ConnectionRequestModel.findOne({
            $or: [
                { fromUserId, toUserId },
                { fromUserId: toUserId, toUserId: fromUserId }
            ]
        });

        if (existingRequest) {
            return res.status(400).send({ message: "Connection request already pending" });
        }

        const connectionRequest = new ConnectionRequestModel({
            fromUserId,
            fromUser: loggedInUser.firstName,
            toUser: toUser.firstName,
            toUserId,
            status
        });

        const data = await connectionRequest.save();
        res.status(200).send({
            message: `${status === 'interested' ? `${loggedInUser.firstName} is interested in ${toUser.firstName}` : `You Ignored ${toUser.firstName}`}`,
            data: data
        });

    } catch (err) {
        res.status(500).send({ message: "Error sending connection request", error: err.message });
    }
});


requestsRouter.post('/request/review/:status/:requestId', userAuth, async (req, res) => {
    try {

        const loggedInUser = req.user;
        const allowedStatuses = ['accepted', 'rejected'];

        if (!allowedStatuses.includes(req.params.status)) {
            return res.status(400).send({ message: "Invalid status" });
        }

        const connectionRequest = await ConnectionRequestModel.findOne({
            _id: req.params.requestId,
            toUserId: loggedInUser._id,
            status: 'interested'
        })

        if(!connectionRequest){
            return res.status(404).send({ message: "Connection request not found" });
        }

        connectionRequest.status = req.params.status;
        const data = await connectionRequest.save();

        res.status(200).json({
            message: `Connection request of ${connectionRequest.fromUser} is ${req.params.status} by ${loggedInUser.firstName} successfully`,
            data: data
        });


    } catch {
        res.status(500).send({ message: "Error reviewing connection request", error: err.message });
    }
})


module.exports = requestsRouter;