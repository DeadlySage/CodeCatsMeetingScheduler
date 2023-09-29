const express = require("express");
const cors = require('cors');
const mongoose = require("mongoose");
const app = express();
const uri = "mongodb+srv://Admin:4321admin@cluster0.lyj1ljm.mongodb.net/scheduler?retryWrites=true&w=majority"

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

app.listen(3001, () => {
    console.log("Listening on port 3001");
});

const usersRouter = require("./routes/users");
app.use("/users", usersRouter);

// #task 66 - Adrian Tandiono
// const meetingRoutes = require('./routes/meetings');
// app.use('/meetings', meetingRoutes);

// const courseSchema = new mongoose.Schema({
//   courseID: String,
//   instructor: [String]
// });

// const Course = mongoose.model("Course", courseSchema);

// app.get("/api/course", async (req, res) => {
//   try {
//     // Add a new course
//     // const newCourse = new Course({ courseID: "test", instructor: ["test"] });
//     // await newCourse.save();

//     // Fetch all courses
//     const course = await Course.find();
//     console.log("Courses:", course);
//     res.json(course);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Failed to fetch course" });
//   }
// });

// // fields for calendar
// const eventSchema = new mongoose.Schema({
//   title: String,
//   start: Date,
//   end: Date
// });

// // calendar events
// const event = mongoose.model('Event', eventSchema);

// // routes
// app.get('/events', async (req, res) => {
//   try {
//     const events = await Event.find();
//     res.json(events);
//   } catch (err) {
//     res.status(500).send(err);
//   }
// });

// // update
// app.post('/events', async (req, res) => {
//   try {
//     const newEvent = new Event(req.body);
//     await newEvent.save();
//     res.json(newEvent);
//   } catch (err) {
//     res.status(500).send(err);
//   }
// });

// #57 connect full calendar to db - michael lawler - 9.17.23

// connect to mongodb
// mongoose.connect(uri)
//   .then(() => console.log('MongoDB Connected'))
//   .catch(err => console.log(err));

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
