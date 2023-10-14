const express = require('express');
const router = express.Router();
const Session = require('../models/session');

// GET current user's ID based on the session
router.get('/current-user-id', async (req, res) => {
    try {
        // Fetch the session using the sessionID from the request
        const currentSession = await Session.findOne({ session_id: req.sessionID });

        if (!currentSession) {
            return res.status(404).json({ error: 'Session not found' });
        }

        res.json({ user_id: currentSession.user_id });
    } catch (error) {
        console.error(error);
        res.status(500).send('Failed to fetch user ID');
    }
});

module.exports = router;