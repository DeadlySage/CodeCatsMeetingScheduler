const mongoose = require("mongoose");

const meetingSchema = new mongoose.Schema({
  instructor_id: mongoose.Schema.Types.ObjectId,
  class_name: String,
  title: String,
  start: Date,
  end: Date,
  link: String,
  attendees: [mongoose.Schema.Types.ObjectId],
  notes: String,
  status: String,
  type_id: Number,
});

const Meeting = mongoose.model('Meeting', meetingSchema);
module.exports = Meeting;