import axios from "axios";
import React, { useState, } from "react";
import { Link, useNavigate } from 'react-router-dom';
import CustomModal from "./CustomModal";
import {UserStatus} from "./Constants";
import bcrypt from 'bcryptjs';

export const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState([]);
    const navigate = useNavigate();
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formErrors = handleFormValidation();
        if(formErrors.length === 0) {
            try{
                setIsLoading(true);
                const response = await axios.get("/users")
                const userList = response.data
                const targetUser = userList.find(user => user.email === email);
                
                if(targetUser === undefined) {
                    setErrors(["Invalid Email or Password"]);
                    setShowErrorModal(true);
                } else { 
                    const isPasswordValid = await bcrypt.compare(password, targetUser.password);
                    if (isPasswordValid) {
                        //Set new session with targetUser
                        handleRedirectToCalendar();
                    } else {
                        setErrors(["Invalid Email or Password"]);
                        setShowErrorModal(true);
                    }
                }
            } catch (err) {
                console.log(err)
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

    const handleRedirectToCalendar = () => {
        navigate("/calendar", {replace: true})
    }

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleFormValidation = () => {
        const emailRegExp = /^[a-zA-Z0-9._%+-]+@csus\.edu$/;
        const result = [];

        if(email.trim() === "") {
            result.push("Missing Email");
        } else if (!emailRegExp.test(email.trim())) {
            result.push("Invalid CSUS Email")
        }
        if(password.trim() === "") {
            result.push("Missing Password");
        }
        setErrors(result);
        return result;
    };

    return (
        <div className="auth-form-container col-md-3 mx-auto">
            <div className="row" style={{textAlign: "center"}}>
                <h2>Welcome Back</h2>
            </div>
            <form className="login-form" onSubmit={handleSubmit}>
                <div className="row">
                    <div className="col">
                        <label htmlFor="email">Email</label>
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <input 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)}
                            type="email" 
                            placeholder="youremail@csus.edu" 
                            id="email" 
                            name="email" 
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <label htmlFor="password" className="password-label">
                            Password
                        </label>
                    </div>
                </div>
                <div className="row">
                    <div className="col">
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
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <button className="button rounded" style={{ width: "100%", marginTop: "25px" }} type="submit">Log In</button>
                    </div>
                </div>
                <div style={{textAlign: "left", marginTop: "15px"}}>
                    <Link to="/register">
                        <button className="link-btn" style={{ marginTop: "15px" }}>Sign Up</button>
                    </Link>
                    <br/>
                    <Link to="/reset-password">
                        <button className="link-btn">Forgot Password</button>
                    </Link>
                </div>
            </form>
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