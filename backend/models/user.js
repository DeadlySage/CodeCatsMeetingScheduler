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
    role_id: {
        type: Number,
        required: true
    },
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    status_id: {
        type: Number,
        required: true
    },
    first_question: {
        type: String,
        required: true
    },
    second_question: {
        type: String,
        required: true
    },
    first_answer: {
        type: String,
        required: true
    },
    second_answer: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model("User", userSchema);