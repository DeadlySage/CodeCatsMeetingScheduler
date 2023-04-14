import React, { useState } from "react";
import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { Login } from "./Components/Login";
import { Register } from "./Components/Register";
import StudentSelectionCourse from "./Components/StudentSelectionCourse";

function App() {
  const [currentForm, setCurrentForm] = useState('login');

  const toggleForm = (formName) => {
    setCurrentForm(formName);
  }

  return (
    <div className="main">
      <Router>
        <div className="topnav">
          <Link to="/register">Signup</Link>
          <Link to="/login">Login</Link>
          <Link to="/">Home</Link>
        </div>
        <div className="App">
          <Routes>
            <Route path="/login" element={<Login onFormSwitch={() => setCurrentForm("register")} />} />
            <Route path="/register" element={<Register onFormSwitch={() => setCurrentForm("login")} />} />
            <Route path="/student-selection-course" element={<StudentSelectionCourse />} />
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;
