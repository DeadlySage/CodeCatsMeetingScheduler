const express = require("express");
const cors = require('cors');
const path = require('path');
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const app = express();
const bcrypt = require("bcrypt");
const User = require("./models/user");
require('dotenv').config();

const UserStatus = {
    pending: 1,
    approved: 2
}

const buildPath = path.join(__dirname, '..', 'build');
app.use(express.static(buildPath));

// app.use(cors());
app.use(express.json());
app.disable('etag');


require("dotenv").config();
app.use(bodyParser.json());

async function connect() {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useUnifiedTopology: true,
            useNewUrlParser: true
        });
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error(error);
    }
}

connect();

const usersRouter = require("./routes/users");
app.use("/api/users", usersRouter);

const meetingRouter = require('./routes/meetings');
app.use('/api/meetings', meetingRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));

//Login Route
app.get('/api/login', async (req, res) => {
    const email = decodeURIComponent(req.query.email);
    const password = decodeURIComponent(req.query.password);
    try {
        // Find the user by email
        const user = await User.findOne({ email: email });

        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Check the password using bcrypt
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Verify User Status
        if (user.status_id === UserStatus.pending) {
            return res.status(401).json({ message: 'Account is still awaiting approval' })
        }

        // Successful login
        res.status(200).json({ loggedInUserId: user.id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
})

app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'build', 'index.html'), function(err){
        if (err) {
            res.status(500).send(err);
        }
    });
})
