import React, { useState } from "react";
import './App.css';
import { Login } from "./Components/Login";
import { Register } from "./Components/Register";

function App() {
  const [currentForm, setCurrentForm] = useState('login');

  const toggleForm = (formName) => {
    setCurrentForm(formName);
  }

  return (
    <div className="main">
      <div class="topnav">
        <a href="#">Login</a>
        <a href="#">Home</a>
      </div>
      <div class = "App">
        {
          currentForm === "login" ? <Login onFormSwitch={toggleForm} /> : <Register onFormSwitch={toggleForm} />
        }
      </div>
    </div>
  );
}

export default App;
