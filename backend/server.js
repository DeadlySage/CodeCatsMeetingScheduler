const express = require("express");
const mongoose = require("mongoose");
const app = express();
const uri = "mongodb+srv://lphan:OqdpVS85l4ivEoQ2@cluster0.lyj1ljm.mongodb.net/Course?retryWrites=true&w=majority"

const courseSchema = new mongoose.Schema({
  courseID: String,
  instructor: [String]
});

const Course = mongoose.model("Course", courseSchema);

async function connect(){
    try{
        await mongoose.connect(uri);
        console.log("Connected to MongoDB");
    }catch (error){
        console.error(error);
    }

}

app.get("/api/course", async (req, res) => {
  try {
    // Add a new course
    // const newCourse = new Course({ courseID: "test", instructor: ["test"] });
    // await newCourse.save();

    // Fetch all courses
    const course = await Course.find();
    console.log("Courses:", course);
    res.json(course);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch course" });
  }
});

const professorSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
});

const Professor = mongoose.model("Professor", professorSchema);

// Create a new professor account
app.post("/api/professors", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const newProfessor = new Professor({ name, email, password });

    await newProfessor.save();
    res.status(201).json(newProfessor);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create professor account" });
  }
});

// Fetch professor account details by ID
app.get("/api/professors/:professorId", async (req, res) => {
  try {
    const professor = await Professor.findById(req.params.professorId);
    if (!professor) {
      return res.status(404).json({ error: "Professor not found" });
    }

    res.json(professor);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch professor account" });
  }
});

connect();
app.listen(3000, () => {
    console.log("Listening on port 3000");
});
