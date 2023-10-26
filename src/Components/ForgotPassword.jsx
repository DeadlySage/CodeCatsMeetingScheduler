import React, { useState } from "react";
import { Link } from 'react-router-dom';

export const ForgotPassword = (props) => {
    const [email, setEmail] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(email);
    }

    return (
        <div className="auth-form-container col-xl-3 col-md-5 col-10 mx-auto">
            <div className="row" style={{textAlign: "center", marginTop: 20}}>
                <h2>Forgot Password?</h2>
            </div>
            <div>
                <form className="login-form" onSubmit={handleSubmit}>
                    <label htmlFor="email">Enter your email</label>
                    <input value={email} onChange={(e) => setEmail(e.target.value)}type="email" placeholder="youremail@csus.edu" id="email" name="email" />
                    <button className="button rounded" style={{ width: "100%", marginTop: "15px" }} type="submit">Submit</button>
                </form>
            </div>
            <Link to="/login">
            <button className="link-btn">Remembered your password? Login here.</button>
        </Link>
        </div>
    )
}

export default ForgotPassword;