import React, { useState } from "react";
import { Link } from 'react-router-dom';

export const PasswordReset = (props) => {
    const [email, setEmail] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(email);
    }

    return (
        <div className="auth-form-container">
            <h2>Reset Password</h2>
            <div style={{ marginTop: "10px" }}>
                <form className="login-form" onSubmit={handleSubmit}>
                    <label htmlFor="email">Enter your email</label>
                    <input value={email} onChange={(e) => setEmail(e.target.value)}type="email" placeholder="youremail@csus.edu" id="email" name="email" />
                    <button className="button rounded" style={{ width: "335px", marginTop: "15px" }} type="submit">Log In</button>
                </form>
            </div>
            <Link to="/login">
            <button className="link-btn">Remembered your password? Login here.</button>
        </Link>
        </div>
    )
}