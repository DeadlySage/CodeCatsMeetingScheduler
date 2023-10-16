/* Michael Lawler - 10.15.23
Jira Task #87
Description
Implement route and model for sessions. Look at how it was done for users for reference. Test using the routes.rest file.
*/

const express = require('express');
const router = express.Router();
const Session = require('../models/session');
const { v4: uuid4 } = require('uuid');

// GET all sessions (similar to the GET all in user.js)
router.get('/', async (req, res) => {
    try {
        const sessions = await Session.find();
        res.json(sessions);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET current user's ID based on the session
router.get('/:session_id', getSession, (req, res) => {
    res.json({ user_id: res.session.user_id });
});

// LOGIN (Create Session)
router.post('/', async (req, res) => {
    const existingSession = await Session.findOne({ user_id: req.body.user_id });
    if (existingSession) {
        return res.status(400).json({ message: "Session already exists for this user." });
    }

    const session = new Session({
        session_id: uuid4(),
        user_id: req.body.user_id,
        created_on: new Date()
    });

    try {
        const newSession = await session.save();
        res.status(201).json(newSession);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// LOGOUT (Delete Session)
router.delete('/:session_id', getSession, async (req, res) => {
    try {
        await res.session.deleteOne();
        res.json({ message: 'Logged out successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Middleware to fetch session
async function getSession(req, res, next) {
    let session;
    try {
        session = await Session.findOne({ session_id: req.params.session_id });
        if (!session) {
            return res.status(404).json({ message: "Cannot find session" });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }

    res.session = session;
    next();
}

module.exports = router;
