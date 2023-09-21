import axios from "axios";
import React, { useState } from "react";
import { Link } from 'react-router-dom';

export const Register = (props) => {
    const [email, setEmail] = useState('');
    const [password, setpassword] = useState('');
    const [first_name, setfirst_name] = useState('');
    const [last_name, setlast_name] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try{
            const response = axios.post("/users", {
                first_name: first_name,
                last_name: last_name,
                email: email,
                password: password,
                role: "student"
            });

            if (response.status == 200){
                //Redirect to the login page
            }
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <div className="auth-form-container">
            <h2>Sign Up</h2>
        <form className="register-form" onSubmit={handleSubmit}>
            <div class="row">
                <label htmlFor="first_name">First Name</label><br />
                <input value={first_name} first_name="first_name" onChange={(e) => setfirst_name(e.target.value)} id="first_name" placeholder="First Name" />
            </div>
            <div class="row">
                <label htmlFor="last_name">Last Name</label><br />
                <input value={last_name} last_name="last_name" onChange={(e) => setlast_name(e.target.value)} id="last_name" placeholder="Last Name" />
            </div>
            <div class="row">
                <label htmlFor="email">Email</label>
                <input value={email} onChange={(e) => setEmail(e.target.value)}type="email" placeholder="youremail@csus.edu" id="email" name="email" />
            </div>
            <div class="row">
                <label htmlFor="password">password</label>
                <input value={password} onChange={(e) => setpassword(e.target.value)} type="password" placeholder="********" id="password" name="password" />
            </div>
            <div class="row">
                <button className="button rounded" style={{ width: "100%", marginTop: "30px" }} type="submit">Submit</button>
            </div>
        </form>
        <Link to="/login">
            <button className="link-btn">Already have an account? Login here.</button>
        </Link>
    </div>
    )
}
