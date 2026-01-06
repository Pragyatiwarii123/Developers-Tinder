const express = require('express');
const { userAuth } = require('../middleware/auth');
const { ConnectionRequestModel } = require('../models/connectionRequest');
const { connect } = require('mongoose');
const { UserModel } = require('../models/user');

const userRequestRouter = express.Router();

const USER_SAFE_FIELDS = "firstName lastName photoUrl age gender skills about"


userRequestRouter.get('/user/requests/received', userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const allreceivedRequests = await ConnectionRequestModel.find({
            toUserId: loggedInUser._id,
            status: 'interested'
        }).populate("fromUserId", USER_SAFE_FIELDS);
        res.status(200).send({
            message: "Received requests fetched successfully",
            data: allreceivedRequests
        });
    } catch (err) {
        res.status(500).send({ message: "Error fetching received requests", error: err.message });
    }
});

userRequestRouter.get('/user/connections', userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const allConnections = await ConnectionRequestModel.find({
            $or: [
                { toUserId: loggedInUser._id, status: 'accepted' },
                { fromUserId: loggedInUser._id, status: 'accepted' }
            ]
        }).populate("fromUserId", USER_SAFE_FIELDS).populate("toUserId", USER_SAFE_FIELDS);
        const data = allConnections.map((row) => {
            if (row.toUserId._id.equals(loggedInUser._id)) {
                return row.fromUserId;
            } else {
                return row.toUserId;
            }
        })
        res.status(200).send({
            message: "Received requests fetched successfully",
            data: data
        });
    } catch (err) {
        res.status(500).send({ message: "Error fetching received requests", error: err.message });
    }
});


userRequestRouter.get("/feed", userAuth, async (req, res) => {
    try {

        const loggedInUser = req.user;

        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        limit = limit > 50 ? 50 : limit
        const skip = (page - 1) * limit;

        const connectedUsers = await ConnectionRequestModel.find({
            $or: [
                { toUserId: loggedInUser._id, },
                { fromUserId: loggedInUser._id, },
            ]
        });

        const hideUsersFromFeed = new Set();

        connectedUsers.forEach((connection) => {
            hideUsersFromFeed.add(connection.toUserId.toString());
            hideUsersFromFeed.add(connection.fromUserId.toString());
        })

        const allFeedUsers = await UserModel.find({
            $and: [
                { _id: { $nin: Array.from(hideUsersFromFeed) } },
                { _id: { $ne: loggedInUser._id } }
            ]
        }).select(USER_SAFE_FIELDS).skip(skip).limit(limit);

        res.status(200).send({
            message: "Feed fetched successfully",
            data: allFeedUsers
        });

    } catch (err) {
        res.status(500).send({ message: "Error fetching feed", error: err.message });
    }
})



module.exports = userRequestRouter