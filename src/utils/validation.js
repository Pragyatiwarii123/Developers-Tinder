const validator = require('validator');

const validateSignUpData = (data) => {

    if (!data.firstName || data.firstName.trim() === '') {
        throw new Error("First name is required.");
    }

    if (!data.emailId || data.emailId.trim() === '') {
        throw new Error("Email ID is required.");
    } else if (!validator.isEmail(data.emailId)) {
        throw new Error("Email ID is invalid.");
    }

    if (!data.password || data.password.length < 6 || !validator.isStrongPassword(data.password)) {
        throw new Error("Password must be at least 6 characters long.");
    }
}

module.exports = {
    validateSignUpData
}