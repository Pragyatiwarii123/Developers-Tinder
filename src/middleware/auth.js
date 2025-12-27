const adminAuth = (req, res, next) => {
    const token = "abcd"
    isAuthorized = token === "abcd";
    if (!isAuthorized) {
        return res.status(403).send('Unauthorised Access');
    } else {
        next();
    }
}

const userAuth = (req, res, next) => {
    console.log("User Auth Middleware");
    const token = "abcd"
    isAuthorized = token === "abcd";
    if (!isAuthorized) {
        return res.status(403).send('Unauthorised Access');
    } else {
        next();
    }
}


module.exports = {
    adminAuth,
    userAuth
}