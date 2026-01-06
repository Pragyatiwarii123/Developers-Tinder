const mongoose = require('mongoose');

const connectionRequestSchema = new mongoose.Schema(
    {
        fromUserId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User"//reference to the User collection
        },
        toUserId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User"//reference to the User collection
        },
        fromUser: { type: String, required: true },
        toUser: { type: String, required: true },
        status: {
            type: String,
            required: true,
            enum: { values: ['interested', 'ignored', 'accepted', 'rejected'], message: '{VALUE} is not of type status' }

        },
    }, {
    timestamps: true,
}
)
//making a compound index to ensure uniqueness of connection requests between two users
connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 });

// connectionRequestSchema.pre('save', function (next) {
//     const connectionRequest = this;
//     if (connectionRequest.fromUserId.toString() === connectionRequest.toUserId.toString()) {
//         throw new Error("Cannot send connection request to oneself!!!!!!!!!!!!!!!!");
//     }
//     next();
// });

const ConnectionRequestModel = mongoose.model('ConnectionRequest', connectionRequestSchema);

module.exports = {
    ConnectionRequestModel
}