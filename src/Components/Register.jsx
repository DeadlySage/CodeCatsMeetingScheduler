import axios from "axios";
import React, { useState, } from "react";
import { Link, useNavigate } from 'react-router-dom';
import "./cssComponents/Register.css";
import CustomModal from "./CustomModal";
import {UserRole} from "./Constants";

export const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [successModal, setSuccessModal] = useState(false);
    const [errors, setErrors] = useState([]);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [showUserExistsModal, setShowUserExistsModal] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();


    const handleSubmit = async (e) => {
        e.preventDefault();
        const formErrors = handleFormValidation();

        if(formErrors.length === 0) {
            try{
                setIsLoading(true);

                const response = await axios.post("/users", {
                    firstName: firstName,
                    lastName: lastName,
                    email: email,
                    password: password,
                    roleId: UserRole.student
                });

                setSuccessModal(true);
            } catch (err) {
                if (err.response.status === 300){
                    setShowUserExistsModal(true);
                } else {
                    console.log(err);
                }
            } finally {
                setIsLoading(false);
            }
        } else {
            setShowErrorModal(true);
        }
    }

    const handleCloseErrorModal = () => {
        setShowErrorModal(false);
    }

    const handleRedirectToLogin = () => {
        navigate("/login", {replace: true})
    }

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleFormValidation = () => {
        const emailRegExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const result = [];

        if(firstName.trim() === "") {
            result.push("Missing First Name");
        }
        if(lastName.trim() === "") {
            result.push("Missing Last Name");
        }
        if(email.trim() === "") {
            result.push("Missing Email");
        } else if (!emailRegExp.test(email.trim())) {
            result.push("Invalid Email");
        }
        if(password.trim() === ""){
            result.push("Missing Password");
        } else {
            if (!/^.{9,}$/.test(password.trim())) {
                result.push("Password must have at least 8 characters");
            } 
            if (!/^.*[A-Z]/.test(password.trim())) {
                result.push("Password must contain an uppercase character");
            } 
            if (!/^.*[a-z]/.test(password.trim())) {
                result.push("Password must contain a lowercase character");
            }
            if (!/^.*[0-9]/.test(password.trim())) {
                result.push("Password must contain a number");
            }
            if (!/^.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\-]/.test(password.trim())) {
                result.push("Password must contain a special character");
            }
        }
        if(password !== confirmPassword) {
            result.push("Passwords do not match");
        }
        setErrors(result);
        return result;
    }

    return (
        <div className="auth-form-container">
            <h2>Sign Up</h2>
            <div>
                <form className="register-form" onSubmit={handleSubmit}>
                    <label htmlFor="firstName">
                        First Name
                    </label>
                    <input 
                        value={firstName} 
                        name="firstName" 
                        onChange={(e) => setFirstName(e.target.value)} 
                        id="firstName" 
                        placeholder="First Name" 
                    />
                    <label htmlFor="lastName">
                        Last Name
                    </label>
                    <input 
                        value={lastName}  
                        name="lastName" 
                        onChange={(e) => setLastName(e.target.value)} 
                        id="lastName" placeholder="Last Name" 
                    />
                    <label htmlFor="email">
                        Email
                    </label>
                    <input 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)}
                        type="email" 
                        placeholder="youremail@csus.edu" 
                        id="email" 
                        name="email" />
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
                    <label htmlFor="confirmPassword">
                        Confirm Password
                        </label>
                    <input 
                        value={confirmPassword} 
                        onChange={(e) => setConfirmPassword(e.target.value)} 
                        type={showPassword ? "text" : "password"} 
                        placeholder={showPassword ? "Enter password" : "********"}                        id="confirmPassword" 
                        name="confirmPassword" 
                    />
                    <button 
                        className="button rounded" 
                        style={{ width: "100%", marginTop: "30px" }} 
                        type="submit"
                    >
                        Submit
                    </button>
                </form>
                <Link to="/login">
                    <button 
                        className="link-btn" 
                        style={{ marginTop: "30px" }}
                    >
                        Already have an account? Login here.
                    </button>
                </Link>
            </div>
            {showErrorModal && (
                <CustomModal
                    title= {
                            <div style={{color: "white"}}>
                                <i className="mdi mdi-alert-circle-outline"></i>
                                {" Error"}
                            </div>}
                    isOpen={showErrorModal}
                    toggle={handleCloseErrorModal}
                    headerBackgroundClass="bg-danger"
                >
                    <ul>
                        {errors.map((error, i) => (
                            <li key={i}>{error}</li>
                        ))}
                    </ul>
                </CustomModal>
            )}
            {successModal && (
                <CustomModal
                    title= {
                            <div style={{color: "white"}}>
                                <i className="bi bi-check-circle-fill"></i>
                                {" Congrats, " + firstName + "!"}
                            </div>
                            }
                    isOpen={successModal}
                    onSubmit={handleRedirectToLogin}
                    submitText={"Log in"}
                    headerBackgroundClass="bg-success"
                >
                        <p>Your account was successfully created. You may now proceed to the login page.</p>
                </CustomModal>
            )}
            {showUserExistsModal && (
                <CustomModal
                    title= {
                            <div style={{color: "black"}}>
                                <i className="bi bi-person-fill"></i>
                                {" User Already Exists"}
                            </div>
                            }
                    toggle={() => {setShowUserExistsModal(false)}}
                    isOpen={showUserExistsModal}
                    headerBackgroundClass="bg-warning"
                >
                    <p>
                        A user with the email <strong>{email}</strong> already exists.
                        <br/><br/>
                        <Link to="/login">Go to login page</Link>
                    </p>
                </CustomModal>
            )}
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