const express = require("express");
const cors = require('cors');
const mongoose = require("mongoose");
const app = express();
const uri = "mongodb+srv://Admin:4321admin@cluster0.lyj1ljm.mongodb.net/scheduler?retryWrites=true&w=majority"
const bcrypt = require("bcrypt");
const User = require("./models/user");
const UserStatus = {
    pending: 1,
    approved: 2,
    declined: 3
}

app.use(cors());
app.use(express.json());

async function connect(){
    try{
        await mongoose.connect(uri);
        console.log("Connected to MongoDB");
    }catch (error){
        console.error(error);
    }
}
  
connect();

const usersRouter = require("./routes/users");
app.use("/users", usersRouter);

const meetingRouter = require('./routes/meetings');
app.use('/meetings', meetingRouter);

app.listen(3001, () => {
    console.log("Listening on port 3001");
});

//Login Route
app.get('/login', async (req, res) => {
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
        } else if (user.status_id === UserStatus.declined) {
            return res.status(401).json({ message: 'Your account has been declined' })
        }

        // Successful login
        res.status(200).json({ loggedInUserId: user.id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
})

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
