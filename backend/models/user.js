const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    },
    meetings: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "meeting"
        }
    ],
    blocked_time: [
        {
            start:{
                type: Date,
                required: true
            },
            end:{
                type: Date,
                required: true
            }
        }
    ],
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
});

module.exports = mongoose.model("User", userSchema);