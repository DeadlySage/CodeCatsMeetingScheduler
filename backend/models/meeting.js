const mongoose = require('mongoose');

const meetingSchema = new mongoose.Schema({
    nstructor_id: {
        type: String,
        required: true
    },
    start: {
        type: Date,
        required: true
    },
    end: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    notes: String,
    link: String,
    attendees: [String]  
});

module.exports = mongoose.model('Meeting', meetingSchema);