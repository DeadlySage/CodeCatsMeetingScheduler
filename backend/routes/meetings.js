const express = require('express');
const router = express.Router();
const Meeting = require('../models/meeting');

// CREATE a new meeting
router.post('/', async (req, res) => {
    try {
        const meeting = new Meeting(req.body); 
        console.log(meeting);
        await meeting.save();
        res.status(201).json(meeting);

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// GET all current user's meetings
router.get('/', async (req, res) => {
    const userId = req.query.userId;
    const instructorId = req.query.instructorId;

    // Use this when getting meetings for a student
    if (userId) {
        try {
            const userMeetings = await Meeting.find({ attendees: { $in: [userId] } });
            res.json(userMeetings);
        } catch (error) {
            res.status(500).json({ error: "Failed to fetch meetings for user" });
        }
    // Use this when gettings meetings for an instructor or admin
    } else if (instructorId) {
        try {
            const userMeetings = await Meeting.find({ instructor_id: instructorId });
            res.json(userMeetings);
        } catch (error) {
            res.status(500).json({ error: "Failed to fetch meetings for user" });
        }
    } else {
        // You can either send back all meetings or send an error depending on your requirements
        try {
            const allMeetings = await Meeting.find();
            res.json(allMeetings);
        } catch (error) {
            res.status(500).json({ error: "Failed to fetch meetings" });
        }
    }
});

// UPDATE  a meeting
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const meeting = await Meeting.findByIdAndUpdate(id, req.body, { new: true });
      if (!meeting) {
            return res.status(404).json({ error: 'Meeting not found' });
      }
        res.json(meeting);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE a meeting

router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const meeting = await Meeting.findByIdAndDelete(id);
      if (!meeting) {
            return res.status(404).json({ error: 'Meeting not found' });
      }
        res.json({ message: 'Meeting deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;