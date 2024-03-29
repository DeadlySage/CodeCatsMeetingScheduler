import React, { useState, useEffect } from "react";
import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Login } from "./Components/Login";
import { Register } from "./Components/Register";
import Calendar from "./Components/Calendar";
import { ForgotPassword } from "./Components/ForgotPassword";
import Navbar from "./Components/Navbar";
import '@mdi/font/css/materialdesignicons.min.css';
import "bootstrap-icons/font/bootstrap-icons.css";
import AdminDashboard from "./Components/AdminDashboard";
import {UserSettings} from "./Components/UserSettings";
import {isUserLoggedIn, isUserAdmin} from './AuthService';


const RequireAuth = ({children}) => {
  const userIsLoggedIn = isUserLoggedIn();
  if (!userIsLoggedIn) {
    return <Navigate to='/login' />;
  }
  return children;
}

const CheckAuth = ({children}) => {
  const userIsLoggedIn = isUserLoggedIn();
  if (userIsLoggedIn) {
    return <Navigate to='/calendar' />;
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
    return  <div style={{margin: '20px', display: 'flex', justifyContent: 'center'}}>
              <div className="alert alert-secondary fade show d-inline-flex text-align-center">
                <strong>Loading ...</strong>
              </div>
            </div>;
  }

  if (!isAdmin) {
    console.log('Redirecting to /login');
    return <Navigate to='/login' />;
  }

  return children;
};



function App() {
  return (
    <div className="main">
      <Router>
        <div className="topnav">
          <Navbar/>
        </div>
        <div className="App">
          <Routes>
            <Route path="/" element={<Navigate replace to="/login" />} />
            <Route path="/login" element={<CheckAuth><Login /></CheckAuth>} />
            <Route path="/register" element={<CheckAuth><Register /></CheckAuth>} />
            <Route path="/reset-password" element={<CheckAuth><ForgotPassword /></CheckAuth>} />
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
