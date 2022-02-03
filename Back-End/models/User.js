const mongoose = require('mongoose')
const validator = require('validator')

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        min: 3,
        max: 15,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        max: 30,
        unique: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
               throw new Error('Email is invalid')
        }
    }
    },
    password: {
        type: String,
        required: true,
        min: 6,
        trim: true,
        validate(value) {
            if(value.includes("password")) {
                throw new Error('Password not acceptable')
            }
        }
    }
}, 
{ timestamps: true }
)

module.exports = mongoose.model("User", UserSchema)