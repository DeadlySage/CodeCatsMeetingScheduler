import React, { useState } from "react";
import { Link } from 'react-router-dom';

export const Login = (props) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(email);
    }

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="auth-form-container">
            <h2>Welcome Back</h2>
            <form className="login-form" onSubmit={handleSubmit}>
                <label htmlFor="email">Email</label>
                <input value={email} onChange={(e) => setEmail(e.target.value)}type="email" placeholder="youremail@csus.edu" id="email" name="email" />
                <label htmlFor="password" className="password-label">
                    Password
                </label>
                <div className="container">
                    <div className="row">
                        <input 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            type={showPassword ? "text" : "password"} 
                            placeholder={showPassword ? "Enter password" : "********"} 
                            id="password" 
                            name="password" 
                            className="col-md-10"
                        />
                        <button
                            type="button"
                            onClick={togglePasswordVisibility}
                            className="password-toggle-button col-md-2"
                        >
                            {showPassword ? 
                                <i className="bi bi-eye" id="passwordIcon"></i> : 
                                <i className="bi bi-eye-slash" id="passwordIcon"></i>}
                        </button>
                    </div>
                </div>
                <button className="button rounded" style={{ width: "100%", marginTop: "15px" }} type="submit">Log In</button>
                <div style={{textAlign: "left", marginTop: "15px"}}>
                    <Link to="/register">
                        <button className="link-btn" style={{ marginTop: "15px" }}>Sign Up</button>
                    </Link>
                    <br/>
                    <Link to="/password-reset">
                        <button className="link-btn">Forgot Password</button>
                    </Link>
                </div>
            </form>
        </div>
    )
}