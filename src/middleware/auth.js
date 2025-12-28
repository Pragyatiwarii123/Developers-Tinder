const jwt = require('jsonwebtoken');
const { UserModel } = require('../models/user');

const userAuth = async (req, res, next) => {
    const cookies = req.cookies;
    const { token } = cookies;
    if (!token) {
        return res.status(401).send({ message: "Unauthorized: No token provided" });
    }
    const decodedMessage = jwt.verify(token, "devTinder@831$");
    const userId = decodedMessage._id;
    const user = await UserModel.findById(userId);
    console.log(user, "middleware user");
    if (!user) {
        return res.status(404).send({ message: "User not found" });
    }
    req.user = user;
    next();
}


module.exports = {
    userAuth
}