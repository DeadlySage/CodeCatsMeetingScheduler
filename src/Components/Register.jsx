import axios from "axios";
import React, { useState } from "react";
import { Link } from 'react-router-dom';
import { AccountCreatedModal } from "./Modals/AccountCreated";

export const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setpassword] = useState('');
    const [reTypePassword, setReTypePassword] = useState('');
    const [first_name, setfirst_name] = useState('');
    const [last_name, setlast_name] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [showLengthError, setShowLengthError] = useState(false);
    const [showUpperError, setShowUpperError] = useState(false);
    const [showLowerError, setShowLowerError] = useState(false);
    const [showDigitError, setShowDigitError] = useState(false);

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
        return password === reTypePassword;
    }

    const hasLength = (password) => {
        result = password.length >= 8;
        setShowLengthError(!result);
        return result;
    }

    const hasUppercase = (password) => {
        result = /[A-Z]/.test(password);
        setShowUpperError(!result);
        return result;
    }

    const hasLowercase = (password) => {
        result = /[a-z]/.test(password);
        setShowLowerError(!result);
        return result;
    }

    const hasDigit = (password) => {
        result = /\d/.test(password);
        setShowDigitError(!result);
        return result;
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
                        <div className="row">
                            <label htmlFor="password">password</label>
                            <input value={password} onChange={(e) => setpassword(e.target.value)} type="password" placeholder="********" id="password" name="password" />
                        </div>
                        <div className="row">
                            {showLengthError && <p>Password must be longer than 8 characters</p>}
                        </div>
                        <div className="row">
                            <label htmlFor="reTypePassword">re-type password</label>
                            <input value={reTypePassword} onChange={(e) => setReTypePassword(e.target.value)} type="password" placeholder="********" id="reTypePassword" name="reTypePassword" />
                        </div>
                        <div className="row">
                            <button className="button rounded" style={{ width: "100%", marginTop: "30px" }} type="submit">Submit</button>
                        </div>
                        <div className="row">
                            <Link to="/login">
                                <button className="link-btn">Already have an account? Login here.</button>
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
