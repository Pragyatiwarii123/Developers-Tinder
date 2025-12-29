const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true,
            minLength: 4,
        },
        lastName: {
            type: String,
        },
        emailId: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
            validate(value) {
                if (!validator.isEmail(value)) {
                    throw new Error("Invalid Email Id");
                }
            }
        },
        password: {
            type: String,
            required: true,
            minLength: 6,
            validate(value) {
                if (!validator.isStrongPassword(value)) {
                    throw new Error("Weak Password");
                }
            }
        },
        age: {
            type: Number,
            min: 18
        },
        gender: {
            type: String,
            // enum: ['male', 'female', 'other']
            validate(value) {
                const allowedGenders = ['male', 'female', 'other'];
                if (!allowedGenders.includes(value)) {
                    throw new Error("Invalid gender");
                }
            }
        },
        about: {
            type: String,
            maxLength: 500,
        },
        photoUrl: {
            type: String,
            default: "https://static.vecteezy.com/system/resources/previews/045/711/185/non_2x/male-profile-picture-placeholder-for-social-media-forum-dating-site-chat-operator-design-social-profile-template-default-avatar-icon-flat-style-free-vector.jpg",
            validate(value) {
                if (!validator.isURL(value)) {
                    throw new Error("Invalid Photo URL");
                }
            }
        },
        skills: {
            type: [String],
        }
    }, {
    timestamps: true,
}
)

userSchema.methods.getJWT = function () {
    const user = this
    const token =  jwt.sign({ _id: user._id }, "devTinder@831$", { expiresIn: '6h' });
    return token;
}

userSchema.methods.validatePassword = async function (passwordInputByUser) {
    const user = this;
    const passwordHash = user.password;
    const isPasswordMatch = await bcrypt.compare(passwordInputByUser, passwordHash);
    return isPasswordMatch;
}
const UserModel = mongoose.model('User', userSchema);

module.exports = {
    UserModel
}