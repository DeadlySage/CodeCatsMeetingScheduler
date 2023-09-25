const express = require("express");
const router = express.Router();
const User = require("../models/user");
const { getSearchQuery } = require("../services/users");
const bcrypt = require('bcryptjs');


//Get all
router.get("/", async (req, res) => {
    try{
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

//Get one
router.get("/:id", async (req, res) => {
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
    const existingUserWithEmail = await getSearchQuery({email: req.body.email});
    if(existingUserWithEmail.length > 0) {
        res.status(300).json({ 
            message: "An account with that email address already exists." 
        })
        return;
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const user = new User({
        first_name : req.body.firstName,
        last_name : req.body.lastName,
        email: req.body.email,
        password: hashedPassword,
        role_id: req.body.roleId
    });
    try {
        const newUser = await user.save();
        res.status(200).json(newUser);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

//Update
router.patch("/:id", getUser, async (req, res) => {
    if ( req.body.firstName != null ) {
        res.user.first_name = req.body.firstName;
    }
    if ( req.body.lastName != null ) {
        res.user.last_name = req.body.lastName;
    }
    if ( req.body.email != null ) {
        res.user.email = req.body.email;
    }
    if ( req.body.password != null ) {
        res.user.password = req.body.password;
    }
    if (req.body.roleId != null) {
        res.user.role_id = req.user.roleId;
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
        await res.user.deleteOne();
        res.json({ message: "Deleted user" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

async function getUser(req, res, next) {
    let user
    try {
        user = await User.findById(req.params.id);
        if ( user == null ){
            return res.status(404).json({ message: "Cannot find user "});
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }

    res.user = user;
    next();
}

module.exports = router;