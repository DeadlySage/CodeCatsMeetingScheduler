import React, { useState, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import CustomModal from "./CustomModal";
import bcrypt from 'bcryptjs';
import {UserRole} from "./Constants";

export const ForgotPassword = (props) => {
    const [email, setEmail] = useState('');
    const [errors, setErrors] = useState([]);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [showMainForm, setShowMainForm] = useState(true);
    const [showQuestionsForm, setShowQuestionsForm] = useState(false);
    const [showPasswordForm, setShowPasswordForm] = useState(false);
    const [firstQuestion, setFirstQuestion] = useState('');
    const [secondQuestion, setSecondQuestion] = useState('');
    const [firstAnswer, setFirstAnswer] = useState('');
    const [secondAnswer, setSecondAnswer] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [user, setUser] = useState(null);
    const [firstResponse, setFirstResponse] = useState('');
    const [secondResponse, setSecondResponse] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showContactAdminModal, setShowContactAdminModal] = useState(false);
    const [admins, setAdmins] = useState([]);
    const navigate = useNavigate();

    const handleMainSubmit = (e) => {
        e.preventDefault();
        const formErrors = handleMainFormValidation();
        if(formErrors.length === 0){
            axios.get('/users', {
                params: {
                    email: email
                }
            })
            .then(function (response) {
                if (response.data && Object.keys(response.data).length > 0) {
                    // User found
                    setUser(response.data);
                } else {
                    // No user found
                    setErrors(['No user found for the provided email']);
                    setShowErrorModal(true);
                }
            })
            .catch(function (error) {
                const returnedError = error.response;
                console.log(error)
                setErrors([returnedError]);
                setShowErrorModal(true);
            });
        }
    }

    useEffect(() => {
        if (user) {
            setFirstQuestion(user.first_question);
            setSecondQuestion(user.second_question);
            setFirstAnswer(user.first_answer);
            setSecondAnswer(user.second_answer);
            setShowMainForm(false);
            setShowQuestionsForm(true);
        }
    }, [user]);

    const handleQuestionsSubmit = async (e) => {
        e.preventDefault();
        const formErrors = handleQuestionsValidation();
        if (formErrors.length === 0) {
            try {
                setIsLoading(true);
                setShowQuestionsForm(false);
                clearInputs();
                setShowPasswordForm(true);
            } catch (err) {
                console.log(err)
                setErrors(['Unable to complete request']);
                setShowErrorModal(true);
            } finally {
                setIsLoading(false);
            }
        } else {
            setShowErrorModal(true);
        }
    }

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        const formErrors = await handlePasswordValidation();
        if (formErrors.length === 0) {
            try {
                setIsLoading(true);
                const hashedPassword = await bcrypt.hash(password, 10);

                await axios.patch("/users/" + user._id, {
                    password: hashedPassword
                });

                setShowPasswordForm(false);
                setShowMainForm(true);
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

    const handleMainFormValidation = () => {
        const result = [];

        if (email.trim() === "") {
            result.push("Missing Email");
        }

        setErrors(result);
        return result;
    };

    const handleQuestionsValidation = () => {
        const result = [];

        if (firstResponse.toLowerCase().trim() !== firstAnswer.toLowerCase().trim()
            || secondResponse.toLowerCase().trim() !== secondAnswer.toLowerCase().trim()
        ) {
            // Answers don't match
            result.push('One or more of your answers are incorrect')
        }

        setErrors(result);
        return result;
    };

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
        }

        setErrors(result);
        return result;
    };

    const handleCloseErrorModal = () => {
        setShowErrorModal(false);
    }

    const handleCloseContactAdminModal = () => {
        setShowContactAdminModal(false);
    }

    const handleQuestionsCancel = () => {
        clearInputs();
        setShowQuestionsForm(false);
        setShowMainForm(true);
    }

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };
    
    const handlePasswordCancel = () => {
        clearInputs();
        setShowPasswordForm(false);
        setShowMainForm(true);
    }

    const handleCloseSuccessModal = () => {
        clearInputs();
        setShowSuccessModal(false);
    }

    const handleRedirectToLogin = () => {
        navigate("/login", {replace: true})
    }

    const handleShowContactAdminModal = () => {
        axios.get('/users', {
            params: {
                roleId: UserRole.admin
            }
        })
        .then(function (response) {
            if (response.data && Object.keys(response.data).length > 0) {
                // Admin found
                console.log(response.data);
                setAdmins(response.data);
            } else {
                // No admin found
                setErrors(['No admin found']);
                setShowErrorModal(true);
            }
        })
        .catch(function (error) {
            const returnedError = error.response;
            console.log(error)
            setErrors([returnedError]);
            setShowErrorModal(true);
        });

        setShowContactAdminModal(true);
    }

    useEffect(() => {
        if (admins) {}
    }, [admins]);

    const clearInputs = () => {
        setFirstResponse('');
        setSecondResponse('');
        setPassword('');
        setConfirmPassword('');
    }

    return (
        <div className="auth-form-container col-xl-3 col-md-5 col-10 mx-auto" style={{ maxWidth: "400px" }}>
            {showMainForm && (
                <div>
                    <div className="row" style={{textAlign: "center", marginTop: 20}}>
                        <h2>Forgot Password?</h2>
                    </div>
                    <div>
                        <form className="login-form" onSubmit={handleMainSubmit}>
                            <label htmlFor="email">Enter your email</label>
                            <input value={email} onChange={(e) => setEmail(e.target.value)}type="email" placeholder="youremail@csus.edu" id="email" name="email" />
                            <button className="button rounded" style={{ width: "100%", marginTop: "25px" }} type="submit">Submit</button>
                            <div>
                                <Link to="/login">
                                    <button className="link-btn" style={{ marginTop: '30px' }}>Log in</button>
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {showQuestionsForm && (
                <div>
                    <div className="row" style={{textAlign: "center", marginTop: 20}}>
                        <h2>Answer Questions</h2>
                    </div>
                    <form className="user-settings-form" onSubmit={handleQuestionsSubmit}>
                        <div className="row" style={{textAlign: "left"}}>
                            <div className="col">
                                <label htmlFor="firstResponse">
                                    {firstQuestion}
                                </label>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col">
                                <input 
                                    value={firstResponse} 
                                    onChange={(e) => setFirstResponse(e.target.value)} 
                                    type="text"
                                    placeholder="Enter your answer"
                                    id="firstResponse" 
                                    name="firstResponse" 
                                />
                            </div>
                        </div>
                        <div className="row" style={{textAlign: "left"}}>
                            <div className="col">
                                <label htmlFor="secondResponse">
                                    {secondQuestion}
                                </label>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col">
                                <input 
                                    value={secondResponse} 
                                    onChange={(e) => setSecondResponse(e.target.value)} 
                                    type="text"
                                    placeholder="Enter your answer"
                                    id="secondResponse" 
                                    name="secondResponse" 
                                />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col">
                                <button 
                                    className="button rounded" 
                                    style={{ 
                                        width: "100%", 
                                        marginTop: "25px", 
                                        backgroundColor: 'gray',
                                        color: 'white'
                                    }}
                                    onClick={handleQuestionsCancel}
                                >
                                    Cancel
                                </button>
                            </div>
                            <div className="col">
                                <button className="button rounded" style={{ width: "100%", marginTop: "25px" }} type="submit">Submit</button>
                            </div>
                        </div>
                    </form>
                    <div style={{textAlign: 'center'}}>
                        <button className="link-btn" style={{ marginTop: '5px', marginBottom: '15px' }} onClick={handleShowContactAdminModal}>Can't remember answers</button>
                    </div>
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
                                    className="button rounded" 
                                    style={{ 
                                        width: "100%", 
                                        marginTop: "25px", 
                                        backgroundColor: 'gray',
                                        color: 'white'
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
                    onSubmit={handleRedirectToLogin}
                    submitText={"Log in"}
                    headerBackgroundClass="bg-success"
                >
                        <p>Your password was successfully reset.</p>
                </CustomModal>
            )}
            {showContactAdminModal && (
                <CustomModal
                    title={
                        <div>
                            <i className="mdi mdi-account"></i>
                            {" Contact Admin"}
                        </div>}
                    isOpen={showContactAdminModal}
                    toggle={handleCloseContactAdminModal}
                >
                    <p>Email one of the admin listed below for help resetting your password:</p>
                    <ul>
                        {admins.map((admin, i) => (
                            <li key={i}>{admin.email}</li>
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

export default ForgotPassword;