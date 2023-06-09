import React, { useState } from "react";
import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { Login } from "./Components/Login";
import { Register } from "./Components/Register";
import StudentSelectionCourse from "./Components/StudentSelectionCourse";
import Home from "./Components/Home";
import AppointmentSelection from "./Components/AppointmentSelection";
import AdvisorSelection from "./Components/AdvisorSelection";
import Calendar from "./Components/Calendar";
import { PasswordReset } from "./Components/PasswordReset";

function App() {
  const [currentForm, setCurrentForm] = useState('login');

  const toggleForm = (formName) => {
    setCurrentForm(formName);
  }

  return (
    <div className="main">
      <Router>
        <div className="topnav">
          <a class="active">Code Cats</a>
          <div className="topnav-links">
            <Link to="/home">Home</Link>
            <Link to="/login">Login</Link>
            <Link to="/register">Sign Up</Link>
            <Link to="/calendar">Calendar</Link>
          </div>
        </div>
        <div className="App">
          <Routes>
            <Route path="/home" element={<Home />} />
            <Route path="/login" element={<Login onFormSwitch={() => setCurrentForm("register")} />} />
            <Route path="/register" element={<Register onFormSwitch={() => setCurrentForm("login")} />} />
            <Route path="/student-selection-course" element={<StudentSelectionCourse />} />
            <Route path="/appointment-selection" element={<AppointmentSelection />} />
            <Route path="/advisor-selection" element={<AdvisorSelection />} />
            <Route path="/password-reset" element={<PasswordReset />} />
            <Route path="/calendar" element ={<Calendar />} />
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;
