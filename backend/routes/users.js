const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Meeting = require('../models/meeting');
const bcrypt = require('bcryptjs');

const UserRole = {
    student: 1,
    instructor: 2,
    admin: 3
}

//Get all 
router.get("/", async (req, res) => {
    const email = req.query.email;
    const roleId = req.query.roleId

    if (email) {
        try {
            const user = await User.findOne({ email: email });
            res.json(user);
        } catch (error) {
            res.status(500).json({ error: "Failed to fetch user" });
        }
    } else if(roleId) {
        try {
            const users = await User.find({ role_id: roleId });
            res.json(users);
        } catch (error) {
            res.status(500).json({ error: "Failed to fetch user" });
        }
    } else {
        try{
            const users = await User.find();
            res.json(users);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }
});

//Get one
router.get("/:id", getUser, async (req, res) => {
    try {
        const user = res.user; // User object from getUser middleware
        
        // Check if a password was provided in the request
        if (!req.body.password) {
            return res.json(user);
        }

        // Compare the provided password with the stored hashed password
        const passwordMatch = await bcrypt.compare(req.body.password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({ message: 'Invalid password' });
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

//Create
router.post("/", async (req, res) => {
    const existingUserWithEmail = await User.findOne({ email: req.body.email })
    if (existingUserWithEmail) {
        return res.status(300).json({ 
            message: "An account with that email address already exists." 
        })
    }

    const user = new User({
        first_name : req.body.firstName,
        last_name : req.body.lastName,
        email: req.body.email,
        password: req.body.password,
        role_id: req.body.roleId,
        status_id: req.body.statusId,
        first_question: req.body.firstQuestion,
        second_question: req.body.secondQuestion,
        first_answer: req.body.firstAnswer,
        second_answer: req.body.secondAnswer
    });
    try {
        const newUser = await user.save();
        res.status(200).json(newUser);
    } catch (err) {
        console.log('An error was caught')
        res.status(400).json({ message: err.message });
    }
});

// Update
router.patch("/:id", getUser, async (req, res) => {
    if (req.body.firstName != null) {
        res.user.first_name = req.body.firstName;
    }
    if (req.body.lastName != null) {
        res.user.last_name = req.body.lastName;
    }
    if (req.body.email != null) {
        res.user.email = req.body.email;
    }
    if (req.body.password != null) {
        res.user.password = req.body.password;
    }
    if (req.body.roleId != null) {
        res.user.role_id = req.body.roleId;
    }
    if (req.body.statusId != null) {
        res.user.status_id = req.body.statusId;
    }
    if (req.body.firstQuestion != null) {
        res.user.first_question = req.body.firstQuestion;
    }
    if (req.body.secondQuestion != null) {
        res.user.second_question = req.body.secondQuestion;
    }
    if (req.body.firstAnswer != null) {
        res.user.first_answer = req.body.firstAnswer;
    }
    if (req.body.secondAnswer != null) {
        res.user.second_answer = req.body.secondAnswer;
    }
    try {
        const updatedUser = await res.user.save();
        res.json(updatedUser);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

//Delete
router.delete("/:id", getUser, async (req, res) => {
    try {
        const userId = res.user._id;
        const roleId = res.user.role_id;
        await res.user.deleteOne();

        if (roleId === UserRole.student) {
            // Find meetings with the user
            const meetingsWithUser = await Meeting.find({ attendees: { $in: [userId] } });

            // Iterate over the meetings and remove the user from their attendees list
            for (const meeting of meetingsWithUser) {
                const index = meeting.attendees.indexOf(userId);
                if (index !== -1) {
                    meeting.attendees.splice(index, 1);
                    await meeting.save();
                }
            }
        } else {
            // Find meetings with the instructor/admin
            const meetingsWithUser = await Meeting.find({ instructor_id: userId });

            // Iterate over and delete each meeting
            for (const meeting of meetingsWithUser) {
                await meeting.deleteOne();
            }
        }

        res.json({ message: "Deleted user" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

async function getUser(req, res, next) {
    let user;
    try {
        user = await User.findById(req.params.id); 
        if (user === null) {
            return res.status(404).json({ message: "Cannot find user" });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }

    res.user = user;
    next();
}


module.exports = router;