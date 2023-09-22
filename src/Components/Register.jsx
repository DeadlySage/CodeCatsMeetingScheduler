import axios from "axios";
import React, { useState } from "react";
import { Link } from 'react-router-dom';
import { AccountCreatedModal } from "./Modals/AccountCreated";

export const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [reTypePassword, setReTypePassword] = useState('');
    const [first_name, setfirst_name] = useState('');
    const [last_name, setlast_name] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [showLengthError, setShowLengthError] = useState(false);
    const [showUpperError, setShowUpperError] = useState(false);
    const [showLowerError, setShowLowerError] = useState(false);
    const [showDigitError, setShowDigitError] = useState(false);
    const [validPassword, setValidPassword] = useState(false);
    const [passwordsMatch, setPasswordsMatch] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if(!verifyPasswordsMatch()){
            console.log("Passwords do not match");
            return;
        }

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
    }

    const verifyPasswordsMatch = () => {
        setPasswordsMatch(password === reTypePassword);
    }

    const isValidPassword = (password) => {
        setPassword(password);
        const length = passwordHasLength(password);
        const upper = passwordHasUppercase(password);
        const lower = passwordHasLowercase(password);
        const digit = passwordHasDigit(password);
        setValidPassword(length && upper && lower && digit);
        return validPassword;
    }

    const passwordHasLength = (password) => {
        const result = password.length >= 8;
        setShowLengthError(!result);
        return result;
    }

    const passwordHasUppercase = (password) => {
        const result = /[A-Z]/.test(password);
        setShowUpperError(!result);
        return result;
    }

    const passwordHasLowercase = (password) => {
        const result = /[a-z]/.test(password);
        setShowLowerError(!result);
        return result;
    }

    const passwordHasDigit = (password) => {
        const result = /\d/.test(password);
        setShowDigitError(!result);
        return result;
    }

    const handlePasswordChange = (password) => {
        setPassword(password);
        isValidPassword(password);
    }
    const handleReTypePasswordChange = (password) => {
        setReTypePassword(password);
        verifyPasswordsMatch();
    }

    return (
        <div className="auth-form-container">
            <form className="register-form" onSubmit={handleSubmit}>
                {!openModal && (
                    <div>
                        <h2>Sign Up</h2>
                        <div className="row">
                            <label htmlFor="first_name">First Name</label><br />
                            <input value={first_name} first_name="first_name" onChange={(e) => setfirst_name(e.target.value)} id="first_name" placeholder="First Name" />
                        </div>
                        <div className="row">
                            <label htmlFor="last_name">Last Name</label><br />
                            <input value={last_name} last_name="last_name" onChange={(e) => setlast_name(e.target.value)} id="last_name" placeholder="Last Name" />
                        </div>
                        <div className="row">
                            <label htmlFor="email">Email</label>
                            <input value={email} onChange={(e) => setEmail(e.target.value)}type="email" placeholder="youremail@csus.edu" id="email" name="email" />
                        </div>
                        {!validPassword && password.length >= 1 && (
                            <div className="row mt-3">
                                <div className="error-message">
                                    {showLengthError && (
                                        <p><i className="mdi mdi-alert-circle-outline"></i> Password must have at least 8 characters</p>
                                    )}
                                    {showUpperError && (
                                        <p><i className="mdi mdi-alert-circle-outline"></i> Password must have an uppercase character</p>
                                    )}
                                    {showLowerError && (
                                        <p><i className="mdi mdi-alert-circle-outline"></i> Password must have a lowercase character</p>
                                    )}
                                    {showDigitError && (
                                        <p><i className="mdi mdi-alert-circle-outline"></i> Password must have a number</p>
                                    )}
                                </div>
                            </div>
                        )}
                        <div className="row">
                            <label htmlFor="password">Password</label>
                            <input value={password} onChange={(e) => handlePasswordChange(e.target.value)} type="password" placeholder="********" id="password" name="password" />
                        </div>
                        {!passwordsMatch && password.length >= 1 && (
                            <div className="row mt-3">
                                <div className="error-message">
                                    <p>Passwords do not match</p>
                                </div>
                            </div>
                        )}
                        <div className="row">
                            <label htmlFor="reTypePassword">Re-type password</label>
                            <input value={reTypePassword} onChange={(e) => handleReTypePasswordChange(e.target.value)} type="password" placeholder="********" id="reTypePassword" name="reTypePassword" />
                        </div>
                        <div className="row" style={{justifyContent: "center"}}>
                            <button className="button rounded" style={{ width: "50%", marginTop: "30px" }} type="submit">Submit</button>
                        </div>
                        <div className="row">
                            <Link to="/login">
                                <button className="link-btn" style={{ marginTop: "30px" }}>Already have an account? Login here.</button>
                            </Link>
                        </div>
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
            </form>
        </div>
    )
}