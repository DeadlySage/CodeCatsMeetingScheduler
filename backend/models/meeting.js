const mongoose = require("mongoose");

const meetingSchema = new mongoose.Schema({
  instructor_id: {
    type: mongoose.Schema.Types.ObjectId,
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
  status_id: {
    type: Number,
    required: true
  },
  notes: {
    type: String,
    required: true
  },
  link: {
    type: String,
    required: false
  },
  attendees: {
    type: [mongoose.Schema.Types.ObjectId],
    required: true
  },
  type_id: {
    type: Number,
    required: true
  },
  title: {
    type: String,
    required: true
  },
});

module.exports = mongoose.model('Meeting', meetingSchema);

