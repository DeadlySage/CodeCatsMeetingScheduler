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
import { ForgotPassword } from "./Components/ForgotPassword";
import Kenneth_Elliot from "./Components/advisor_calendar/Kenneth_Elliot";
import SpongeBob_Squarepants from "./Components/advisor_calendar/SpongeBob_Squarepants";
import Patrick_Star from "./Components/advisor_calendar/Patrick_Star";
import Yu_Chen from "./Components/advisor_calendar/Yu_Chen";
import Navbar from "./Components/Navbar";
import { Navigate } from 'react-router-dom';
import '@mdi/font/css/materialdesignicons.min.css';
import "bootstrap-icons/font/bootstrap-icons.css";

function App() {
  const [currentForm, setCurrentForm] = useState('login');

  const toggleForm = (formName) => {
    setCurrentForm(formName);
  }

  return (
    <div className="main">
      <Router>
        <div className="topnav">
          <Navbar />
        </div>
        <div className="App">
          <Routes>
            <Route path="/home" element={<Home />} />
            <Route path="/" element={<Navigate replace to="/home" />} />
            <Route path="/login" element={<Login onFormSwitch={() => setCurrentForm("register")} />} />
            <Route path="/register" element={<Register onFormSwitch={() => setCurrentForm("login")} />} />
            <Route path="/student-selection-course" element={<StudentSelectionCourse />} />
            <Route path="/appointment-selection" element={<AppointmentSelection />} />
            <Route path="/advisor-selection" element={<AdvisorSelection />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/Kenneth_Elliot" element={<Kenneth_Elliot />} />
            <Route path="/SpongeBob_Squarepants" element={<SpongeBob_Squarepants />} />
            <Route path="/Yu_Chen" element={<Yu_Chen />} />
            <Route path="/Patrick_Star" element={<Patrick_Star />} />
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;
