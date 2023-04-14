import React, { useState } from "react";
import { Link } from 'react-router-dom';

export const StudentSelectionCourse = (props) => {
    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(email);
    }

    return (
        <div className="auth-form-container">
            <h2>Welcome Back</h2>
            <form className="login-form" onSubmit={handleSubmit}>
                <label htmlFor="email">email</label>
                <input value={email} onChange={(e) => setEmail(e.target.value)}type="email" placeholder="youremail@csus.edu" id="email" name="email" />
                <label htmlFor="password">password</label>
                <input value={pass} onChange={(e) => setPass(e.target.value)} type="password" placeholder="********" id="password" name="password" />
                <button type="submit">Log In</button>
            </form>
            <Link to="/register">
                <button className="link-btn">Don't have an account? Register here.</button>
            </Link>
            <Link to="/student-selection-course">
                <button className="link-btn">Go to Student Selection Course</button>
            </Link>
        </div>
    )
}