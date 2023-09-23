import axios from "axios";
import React, { useState, } from "react";
import { Link, useNavigate } from 'react-router-dom';
import "./cssComponents/Register.css";
import CustomModal from "./CustomModal";

export const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [first_name, setfirst_name] = useState('');
    const [last_name, setlast_name] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [successModal, setSuccessModal] = useState(false);
    const [errors, setErrors] = useState([]);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();


    const handleSubmit = async (e) => {
        e.preventDefault();
        const formErrors = handleFormValidation();

        if(formErrors.length === 0) {
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
                    setSuccessModal(true);
                }
            } catch (err) {
                console.log(err);
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

        if(first_name.trim() === "") {
            result.push("Missing First Name");
        }
        if(last_name.trim() === "") {
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
                    <label htmlFor="first_name">
                        First Name
                    </label>
                    <input 
                        value={first_name} 
                        name="first_name" 
                        onChange={(e) => setfirst_name(e.target.value)} 
                        id="first_name" 
                        placeholder="First Name" 
                    />
                    <label htmlFor="last_name">
                        Last Name
                    </label>
                    <input 
                        value={last_name}  
                        name="last_name" 
                        onChange={(e) => setlast_name(e.target.value)} 
                        id="last_name" placeholder="Last Name" 
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
                        <button
                            type="button"
                            onClick={togglePasswordVisibility}
                            className="password-toggle-button"
                        >
                            {showPassword ? 
                                <i className="bi bi-eye"></i> : 
                                <i className="bi bi-eye-slash"></i>}
                        </button>
                    </label>
                    <input 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    type={showPassword ? "text" : "password"} 
                    placeholder="********" 
                    id="password" 
                    name="password" 
                    />
                    <label htmlFor="confirmPassword">
                        Confirm Password
                        </label>
                    <input 
                        value={confirmPassword} 
                        onChange={(e) => setConfirmPassword(e.target.value)} 
                        type={showPassword ? "text" : "password"} 
                        placeholder="********" 
                        id="confirmPassword" 
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
                    title= {<div><i class="mdi mdi-alert-circle-outline"></i> Errors Occurred</div>}
                    isOpen={showErrorModal}
                    toggle={handleCloseErrorModal}
                    onCancel={handleCloseErrorModal}
                    headerBackgroundClass="bg-danger"
                    cancelText={"Close"}
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
                            <i class="bi bi-check-circle-fill"></i>
                            {" Congrats, " + first_name + "!"}
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