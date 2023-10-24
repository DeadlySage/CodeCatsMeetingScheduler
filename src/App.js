import React, { useState } from "react";
import './App.css';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
import { Login } from "./Components/Login";
import { Register } from "./Components/Register";
import AppointmentSelection from "./Components/AppointmentSelection";
import AdvisorSelection from "./Components/AdvisorSelection";
import Calendar from "./Components/Calendar";
import { ForgotPassword } from "./Components/ForgotPassword";
import Navbar from "./Components/Navbar";
import '@mdi/font/css/materialdesignicons.min.css';
import "bootstrap-icons/font/bootstrap-icons.css";
import ResetPassword from "./Components/ResetPassword";
import Security from "./Components/Security";
import AdminDashboard from "./Components/AdminDashboard";
import HompageCalendar from "./Components/HomepageCalendar";
import {isUserLoggedIn} from './AuthService';

const RequireAuth = ({children}) => {
  const userIsLoggedIn = isUserLoggedIn();
  if (!userIsLoggedIn) {
    return <Navigate to='/login' />;
  }
  return children;
}

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
            <Route path="/" element={<Navigate replace to="/login" />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/user-homepage-calendar" element={<RequireAuth><HompageCalendar /></RequireAuth>} />
            <Route path="/appointment-selection" element={<RequireAuth><AppointmentSelection /></RequireAuth>} />
            <Route path="/advisor-selection" element={<RequireAuth><AdvisorSelection /></RequireAuth>} />
            <Route path="/reset-password" element={<ForgotPassword />} />
            <Route path="/security" element={<RequireAuth><Security /></RequireAuth>} />
            <Route path="/calendar" element={<RequireAuth><Calendar /></RequireAuth>} />
            <Route path="/admin-dashboard" element={<RequireAuth><AdminDashboard /></RequireAuth>} />
          </Routes>
        </div>
      </Router>
    </div>
  );

}

export default App;
