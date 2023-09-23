import axios from "axios";
import React, { useState } from "react";
import { Link } from 'react-router-dom';
import { AccountCreatedModal } from "./Modals/AccountCreated";
import "./cssComponents/Register.css";

export const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [first_name, setfirst_name] = useState('');
    const [last_name, setlast_name] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [errors, setErrors] = useState([]);
    const [showErrorModal, setShowErrorModal] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Entered handleSubmit");
        console.log("Errors before clearing = " + errors.toString());
        setErrors([]);
        console.log("Cleared errors. Errors = " + errors.toString());
        handleFormValidation();
        console.log("Validated form. Errors = " + errors.toString());

        if(errors.length === 0) {
            try{
                setIsLoading(true);
    
                const response = await axios.post("/users", {
                    first_name: first_name,
                    last_name: last_name,
                    email: email,
                    password: password,
                    role: "student"
                });
                
                if (response.status === 201){
                    setOpenModal(true);
                }
            } catch (err) {
                console.log(err);
            } finally {
                setTimeout(() => {
                    setIsLoading(false);
                }, 500); 
            }
        } else {
            setErrors(errors);
            setShowErrorModal(true);
        }
    }

    const handleFormValidation = () => {
        const regExp = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

        if(first_name.trim() === "") {
            setErrors([...errors, "Please enter your first name"]);
        }
        if(last_name.trim() === "") {
            setErrors([...errors, "Please enter your last name"]);
        }
        if(email.trim() === "") {
            setErrors([...errors, "Please enter your email"]);
        }
        if(password.trim() === "" || !regExp.test(password.trim())){
            setErrors([...errors, "Password is invalid"]);
            setErrors([...errors, "Password must have 8 characters"]);
            setErrors([...errors, "Password must have an uppercase character"]);
            setErrors([...errors, "Password must have a lowercase character "]);
            setErrors([...errors, "Password must have a number"]);
            setErrors([...errors, "Password must have a special character"]);
        }
        if(password !== confirmPassword) {
            setErrors([...errors, "Passwords do not match"]);
        }
    }

    return (
        <div className="auth-form-container">
            <h2>Sign Up</h2>
            <div>
                <form className="register-form" onSubmit={handleSubmit}>
                    <label htmlFor="first_name">First Name</label>
                    <input value={first_name} name="first_name" onChange={(e) => setfirst_name(e.target.value)} id="first_name" placeholder="First Name" />
                    <label htmlFor="last_name">Last Name</label>
                    <input value={last_name} name="last_name" onChange={(e) => setlast_name(e.target.value)} id="last_name" placeholder="Last Name" />
                    <label htmlFor="email">Email</label>
                    <input value={email} onChange={(e) => setEmail(e.target.value)}type="email" placeholder="youremail@csus.edu" id="email" name="email" />
                    <label htmlFor="password">Password</label>
                    <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="********" id="password" name="password" />
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <input value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} type="password" placeholder="********" id="confirmPassword" name="confirmPassword" />
                    <button className="button rounded" style={{ width: "100%", marginTop: "30px" }} type="submit">Submit</button>
                </form>
                <Link to="/login">
                    <button className="link-btn" style={{ marginTop: "30px" }}>Already have an account? Login here.</button>
                </Link>
            </div>
            {showErrorModal && (
                <div className="error-modal">
                    <h3><i className="mdi mdi-alert-circle-outline"></i> Error(s) occurred:</h3>
                    <ul>
                        {errors.map((error, i) => (
                            <li key={i}>{error}</li>
                        ))}
                    </ul>
                    <button onClick={() => setShowErrorModal(false)}>Close</button>
                </div>
            )}
            {openModal && <AccountCreatedModal />}
            {isLoading && (
                <div className="loading-overlay">
                    <div className="loading-spinner">
                        <div className="spinner"></div>
                    </div>
                </div>
            )}
        </div>
    )
}