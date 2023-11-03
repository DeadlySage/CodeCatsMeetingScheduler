const mongoose = require("mongoose");

const meetingSchema = new mongoose.Schema({
  instructor_id: mongoose.Schema.Types.ObjectId,
  start: Date,
  end: Date,
  status_id: Number,
  notes: String,
  link: String,
  attendees: [mongoose.Schema.Types.ObjectId],
  type_id: Number,
  title: String
});

  const Meeting = mongoose.model('Meeting', meetingSchema);
  module.exports = Meeting;