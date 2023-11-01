import React, { useState, useEffect } from "react";
import './App.css';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useNavigate  } from "react-router-dom";
import { Login } from "./Components/Login";
import { Register } from "./Components/Register";
import AppointmentSelection from "./Components/AppointmentSelection";
import AdvisorSelection from "./Components/AdvisorSelection";
import Calendar from "./Components/Calendar";
import { ForgotPassword } from "./Components/ForgotPassword";
import Navbar from "./Components/Navbar";
import '@mdi/font/css/materialdesignicons.min.css';
import "bootstrap-icons/font/bootstrap-icons.css";
import Security from "./Components/Security";
import AdminDashboard from "./Components/AdminDashboard";
import HompageCalendar from "./Components/HomepageCalendar";
import {UserSettings} from "./Components/UserSettings";
import {isUserLoggedIn, isUserAdmin} from './AuthService';


const RequireAuth = ({children}) => {
  const userIsLoggedIn = isUserLoggedIn();
  if (!userIsLoggedIn) {
    return <Navigate to='/login' />;
  }
  return children;
}

const RequireAdmin = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(null);

  useEffect(() => {
    const checkAdminRole = async () => {
      const admin = await isUserAdmin();
      setIsAdmin(admin);
    };

    checkAdminRole();
  }, []);

  if (isAdmin === null) {
    // The isAdmin value is still pending (not yet resolved).
    return <div>Loading...</div>;
  }

  if (!isAdmin) {
    console.log('Redirecting to /login');
    return <Navigate to='/login' />;
  }

  return children;
};



function App() {
  const [currentForm, setCurrentForm] = useState('login');

  const toggleForm = (formName) => {
    setCurrentForm(formName);
  }

  return (
    <div className="main">
      <Router>
        <div className="topnav">
          <Navbar/>
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
            <Route path="/admin-dashboard" element={<RequireAuth><RequireAdmin><AdminDashboard /></RequireAdmin></RequireAuth>} />
            <Route path="/user-settings" element={<RequireAuth><UserSettings /></RequireAuth>} />
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;
