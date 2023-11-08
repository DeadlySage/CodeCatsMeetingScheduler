import React, { useState, } from "react";
import { useNavigate } from 'react-router-dom';
import CustomModal from "./CustomModal";
import { getLoggedInUser } from '../AuthService';
import bcrypt from 'bcryptjs';
import axios from 'axios';

export const UserSettings = () => {
    const [errors, setErrors] = useState([]);
    const [showPassword, setShowPassword] = useState(false);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [firstQuestion, setFirstQuestion] = useState('');
    const [secondQuestion, setSecondQuestion] = useState('');
    const [firstAnswer, setFirstAnswer] = useState('');
    const [secondAnswer, setSecondAnswer] = useState('');
    const navigate = useNavigate();
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [showOptionsForm, setShowOptionsForm] = useState(true);
    const [showPasswordForm, setShowPasswordForm] = useState(false);
    const [showQuestionsForm, setShowQuestionsForm] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        const loggedInUser = await getLoggedInUser();
        const formErrors = await handlePasswordValidation();
        if (formErrors.length === 0) {
            try {
                setIsLoading(true);
                const hashedPassword = await bcrypt.hash(password, 10);

                await axios.patch("/api/users/" + loggedInUser._id, {
                    password: hashedPassword
                });

                setShowPasswordForm(false);
                setShowOptionsForm(true);
                setShowSuccessModal(true);
            } catch (err) {
                setErrors([err.response.data.message]);
                setShowErrorModal(true);
            } finally {
                setIsLoading(false);
            }
        } else {
            setShowErrorModal(true);
        }
    }

    const handleQuestionsSubmit = async (e) => {
        e.preventDefault();
        const loggedInUser = await getLoggedInUser();
        const formErrors = handleQuestionsValidation();
        if (formErrors.length === 0) {
            try {
                setIsLoading(true);
                
                await axios.patch("/api/users/" + loggedInUser._id, {
                    firstQuestion: firstQuestion,
                    secondQuestion: secondQuestion,
                    firstAnswer: firstAnswer,
                    secondAnswer: secondAnswer
                });

                setShowQuestionsForm(false);
                setShowOptionsForm(true);
                setShowSuccessModal(true);
            } catch (err) {
                console.log(err)
                // setErrors([err.response.data.message]);
                setShowErrorModal(true);
            } finally {
                setIsLoading(false);
            }
        } else {
            setShowErrorModal(true);
        }
    }

    const clearInputs = () => {
        setPassword('');
        setConfirmPassword('');
        setFirstQuestion('');
        setSecondQuestion('');
        setFirstAnswer('');
        setSecondAnswer('');
    }

    const handleRedirectToCalendar = () => {
        navigate("/calendar", { replace: true })
    }

    const handleResetClick = () => {
        setShowOptionsForm(false);
        setShowPasswordForm(true);
    }

    const handleChangeClick = () => {
        setShowOptionsForm(false);
        setShowQuestionsForm(true);
    }

    const handleCloseErrorModal = () => {
        setShowErrorModal(false);
    }

    const handleCloseSuccessModal = () => {
        clearInputs();
        setShowSuccessModal(false);
    }

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };
    
    const handlePasswordCancel = () => {
        setShowPasswordForm(false);
        clearInputs();
        setShowOptionsForm(true);
    }

    const handleQuestionsCancel = () => {
        setShowQuestionsForm(false);
        clearInputs();
        setShowOptionsForm(true);
    }

    const handlePasswordValidation = async () => {
        const result = [];

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
        } else {
            const loggedInUser = await getLoggedInUser();
            const oldPasswordMatch = await bcrypt.compare(password.trim(), loggedInUser.password.trim());
            if (oldPasswordMatch) {
                result.push("Password cannot be your old password");
            }
        }

        setErrors(result);
        return result;
    };

    const handleQuestionsValidation = () => {
        const result = [];

        if(firstQuestion.trim() === "") {
            result.push("Missing First Security Question");
        }
        if(secondQuestion.trim() === "") {
            result.push("Missing Second Security Question");
        }
        if(firstAnswer.trim() === "") {
            result.push("Missing Answer to First Security Question");
        }
        if(secondAnswer.trim() === "") {
            result.push("Missing Asnwer to Second Security Question");
        }
        if(firstQuestion.trim().toLowerCase() === secondQuestion.trim().toLowerCase()) {
            result.push("Security Questions Must Be Different");
        }

        setErrors(result);
        return result;
    };

    return (
        <div className="auth-form-container col-xl-3 col-md-5 col-10 mx-auto" style={{ maxWidth: "400px" }}>
            {showOptionsForm && (
                <div>
                    <div className="row" style={{textAlign: "center", marginTop: 20}}>
                        <h2>User Settings</h2>
                    </div>
                    <form className="user-settings-form">
                        <button className="button rounded" onClick={handleResetClick} style={{marginBottom: "15px"}}>Reset Password</button>
                        <button className="button rounded" onClick={(handleChangeClick)} style={{marginBottom: "15px"}}>Change Security Questions</button>
                        <div className="col">
                                <button 
                                    className="cancel-button" 
                                    style={{ 
                                        width: "100%", 
                                    }}
                                    onClick={handleRedirectToCalendar}
                                >
                                    Return to calendar
                                </button>
                            </div>
                    </form>
                </div>
            )}
            {showPasswordForm && (
                <div>
                    <div className="row" style={{textAlign: "center", marginTop: 20}}>
                        <h2>Reset Password</h2>
                    </div>
                    <form className="user-settings-form" onSubmit={handlePasswordSubmit}>
                        <div className="row" style={{textAlign: "left"}}>
                            <div className="col">
                                <label htmlFor="password" className="password-label">
                                    New Password
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
                                            className="col-md-10 col-10"
                                        />
                                        <button
                                            type="button"
                                            onClick={togglePasswordVisibility}
                                            className="password-toggle-button col-md-2 col-2"
                                        >
                                        {showPassword ? 
                                            <i className="bi bi-eye" id="passwordIcon"></i> : 
                                            <i className="bi bi-eye-slash" id="passwordIcon"></i>}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row" style={{textAlign: "left"}}>
                            <div className="col">
                                <label htmlFor="confirmPassword">
                                    Confirm New Password
                                </label>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col">
                                <input 
                                    value={confirmPassword} 
                                    onChange={(e) => setConfirmPassword(e.target.value)} 
                                    type={showPassword ? "text" : "password"} 
                                    placeholder={showPassword ? "Enter password" : "********"}
                                    id="confirmPassword" 
                                    name="confirmPassword" 
                                />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col">
                                <button 
                                    className="cancel-button" 
                                    style={{ 
                                        width: "100%", 
                                        marginTop: "25px", 
                                    }}
                                    onClick={handlePasswordCancel}
                                >
                                    Cancel
                                </button>
                            </div>
                            <div className="col">
                                <button className="button rounded" style={{ width: "100%", marginTop: "25px" }} type="submit">Save</button>
                            </div>
                        </div>
                    </form>
                </div>
            )}
            {showQuestionsForm && (
                <div>
                    <div className="row" style={{textAlign: "center", marginTop: 20}}>
                        <h2>Reset Questions</h2>
                    </div>
                    <form className="user-settings-form" onSubmit={handleQuestionsSubmit}>
                        <div className="row" style={{textAlign: "left"}}>
                            <div className="col">
                                <label htmlFor="firstQuestion">
                                    Security Question 1
                                </label>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col">
                                <input 
                                    value={firstQuestion} 
                                    onChange={(e) => setFirstQuestion(e.target.value)} 
                                    type="text"
                                    placeholder="Type your own question"
                                    id="firstQuestion" 
                                    name="firstQuestion" 
                                />
                            </div>
                        </div>
                        <div className="row" style={{textAlign: "left"}}>
                            <div className="col">
                                <label htmlFor="firstAnswer">
                                    Answer
                                </label>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col">
                                <input 
                                    value={firstAnswer} 
                                    onChange={(e) => setFirstAnswer(e.target.value)} 
                                    type="text"
                                    placeholder="Enter your answer"
                                    id="firstAnswer" 
                                    name="firstAnswer" 
                                />
                            </div>
                        </div>
                        <div className="row" style={{textAlign: "left"}}>
                            <div className="col">
                                <label htmlFor="secondQuestion">
                                    Security Question 2
                                </label>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col">
                                <input 
                                    value={secondQuestion} 
                                    onChange={(e) => setSecondQuestion(e.target.value)} 
                                    type="text"
                                    placeholder="Type your own question"
                                    id="secondQuestion" 
                                    name="secondQuestion" 
                                />
                            </div>
                        </div>
                        <div className="row" style={{textAlign: "left"}}>
                            <div className="col">
                                <label htmlFor="secondAnswer">
                                    Answer
                                </label>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col">
                                <input 
                                    value={secondAnswer} 
                                    onChange={(e) => setSecondAnswer(e.target.value)} 
                                    type="text"
                                    placeholder="Enter your answer"
                                    id="secondAnswer" 
                                    name="secondAnswer" 
                                />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col">
                                <button 
                                    className="cancel-button" 
                                    style={{ 
                                        width: "100%", 
                                        marginTop: "25px"
                                    }}
                                    onClick={handleQuestionsCancel}
                                >
                                    Cancel
                                </button>
                            </div>
                            <div className="col">
                                <button className="button rounded" style={{ width: "100%", marginTop: "25px" }} type="submit">Save</button>
                            </div>
                        </div>
                    </form>
                </div>
            )}
            {showErrorModal && (
                <CustomModal
                    title={
                        <div style={{ color: "white" }}>
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
            {showSuccessModal && (
                <CustomModal
                    title= {
                            <div style={{color: "white"}}>
                                <i className="bi bi-check-circle-fill"></i>
                                {' Success'}
                            </div>
                            }
                    isOpen={showSuccessModal}
                    toggle={handleCloseSuccessModal}
                    submitText={"Log in"}
                    headerBackgroundClass="bg-success"
                >
                        <p>Your changes were saved successfully.</p>
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