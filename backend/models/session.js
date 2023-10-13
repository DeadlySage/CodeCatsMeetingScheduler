const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
    session_id: String,
    user_id: String,
    created_on: Date
});

module.exports = mongoose.model('Session', sessionSchema);