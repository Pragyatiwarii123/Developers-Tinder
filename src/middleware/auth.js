const jwt = require('jsonwebtoken');
const { UserModel } = require('../models/user');

const userAuth = async (req, res, next) => {
    const cookies = req.cookies;
    const { token } = cookies;
    if (!token) {
        return res.status(401).send({ message: "Unauthorized: Token Expired, PLease Login!!!!!!" });
    }
    const decodedMessage = jwt.verify(token, "devTinder@831$");
    const userId = decodedMessage._id;
    const user = await UserModel.findById(userId);
    if (!user) {
        return res.status(404).send({ message: "User not found" });
    }
    req.user = user;
    next();
}


module.exports = {
    userAuth
}