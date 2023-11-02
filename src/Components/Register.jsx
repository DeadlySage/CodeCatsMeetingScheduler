import axios from "axios";
import React, { useState, } from "react";
import { Link, useNavigate } from 'react-router-dom';
import CustomModal from "./CustomModal";
import {UserRole, UserStatus} from "./Constants";
import bcrypt from 'bcryptjs';

export const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [firstQuestion, setFirstQuestion] = useState('');
    const [secondQuestion, setSecondQuestion] = useState('');
    const [firstAnswer, setFirstAnswer] = useState('');
    const [secondAnswer, setSecondAnswer] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [successModal, setSuccessModal] = useState(false);
    const [errors, setErrors] = useState([]);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [pendingModal, setPendingModal] = useState(false);
    const [showUserExistsModal, setShowUserExistsModal] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [accountType, setAccountType] = useState(UserRole.student);
    const [status, setStatus] = useState(UserStatus.approved);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formErrors = handleFormValidation();

        if(formErrors.length === 0) {
            try{
                setIsLoading(true);
                const hashedPassword = await bcrypt.hash(password, 10);

                await axios.post("/users", {
                    firstName: firstName,
                    lastName: lastName,
                    email: email,
                    password: hashedPassword,
                    roleId: accountType,
                    statusId: status,
                    firstQuestion: firstQuestion,
                    secondQuestion: secondQuestion,
                    firstAnswer: firstAnswer,
                    secondAnswer: secondAnswer
                });

                if (status === UserStatus.pending){
                    setPendingModal(true)
                } else {
                    setSuccessModal(true);
                }

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

    const handleClosePendingModal = () => {
        setPendingModal(false);
    }

    const handleRedirectToLogin = () => {
        navigate("/login", {replace: true})
    }

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleAccountTypeChange = (e) => {
        setAccountType(e.target.value);
        console.log(e.target.value)
        if (e.target.value === UserRole.student.toString()) {
            console.log('Setting status to approved')
            setStatus(UserStatus.approved);
        } else {
            console.log('Setting status to pending')
            setStatus(UserStatus.pending);
        }
    };      

    const handleFormValidation = () => {
        const emailRegExp = /^[a-zA-Z0-9._%+-]+@csus\.edu$/;
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
            result.push("Invalid CSUS Email");
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
    }

    return (
        <div className="auth-form-container col-xl-8 col-md-10 col-10 mx-auto">
            <div className="row" style={{textAlign: "center", marginTop: 20}}>
                <h2>Sign Up</h2>
            </div>
            <div>
                <form className="register-form" onSubmit={handleSubmit}>
                    <div className="row">
                        <div className="col-md-6">
                            <div className="row" style={{textAlign: "left"}}>
                                <div className="col">
                                    <label htmlFor="firstName">
                                        First Name
                                    </label>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col">
                                    <input 
                                        value={firstName} 
                                        name="firstName" 
                                        onChange={(e) => setFirstName(e.target.value)} 
                                        id="firstName" 
                                        placeholder="First Name" 
                                    />
                                </div>
                            </div>
                            <div className="row" style={{textAlign: "left"}}>
                                <div className="col">
                                    <label htmlFor="lastName">
                                        Last Name
                                    </label>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col">
                                    <input 
                                        value={lastName}  
                                        name="lastName" 
                                        onChange={(e) => setLastName(e.target.value)} 
                                        id="lastName" 
                                        placeholder="Last Name" 
                                        className=""
                                    />
                                </div>
                            </div>
                            <div className="row" style={{textAlign: "left"}}>
                                <div className="col">
                                    <label htmlFor="email">
                                        Email
                                    </label>
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
                            <div className="row" style={{textAlign: "left"}}>
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
                                        Confirm Password
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
                        </div>
                        <div className="col-md-6">
                            <div className="row">
                                <div style={{textAlign: 'left'}}>
                                    <label>Account Type</label>
                                </div>
                                <div style={{textAlign: 'center'}}>
                                    <div className="row" style={{marginBottom: "16.25px"}}>
                                        <div className="col-md-3 col-3" style={{display: "flex", justifyContent: "flex-end"}}>Student</div>
                                        <div className="col-md-3 col-3" style={{display: "flex", justifyContent: "flex-start"}}>
                                            <input 
                                                type="radio" 
                                                name="accountType"
                                                value={UserRole.student}  
                                                onChange={handleAccountTypeChange}
                                                style={{ marginLeft: "0px", marginRight: "70px" }}
                                                defaultChecked
                                            />
                                        </div>
                                        <div className="col-md-3 col-3" style={{display: "flex", justifyContent: "flex-end"}}>Instructor</div>
                                        <div className="col-md-3 col-3" style={{display: "flex", justifyContent: "flex-start"}}>
                                            <input 
                                                type="radio" 
                                                name="accountType" 
                                                value={UserRole.instructor} 
                                                onChange={handleAccountTypeChange}
                                                style={{ marginLeft: "0px", marginRight: "70px" }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
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
                        </div>
                    </div>
                    <div className="row">
                        <div className="col">
                            <div style={{ display: "flex", justifyContent: "flex-start" }}>
                                <div className="row">
                                    <div className="col">
                                        <Link to="/login">
                                            <button 
                                                className="link-btn" 
                                                style={{ marginTop: "30px" }}
                                            >
                                                Log in
                                            </button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col">
                            <div style={{ display: "flex", justifyContent: "flex-end" }}>
                                <div className="row">
                                    <div className="col">
                                        <button 
                                            className="button rounded" 
                                            style={{ width: "100%", marginTop: "30px", paddingLeft: "50px", paddingRight: "50px" }} 
                                            type="submit"
                                        >
                                            Submit
                                        </button> 
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
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
                        <p>Your account was successfully created. 
                            You may now proceed to the login page.</p>
                </CustomModal>
            )}
            {pendingModal && (
                <CustomModal
                    title= {
                            <div style={{color: "white"}}>
                                <i className="bi bi-check-circle-fill"></i>
                                {" Congrats, " + firstName + "!"}
                            </div>
                            }
                    isOpen={pendingModal}
                    toggle={handleClosePendingModal}
                    headerBackgroundClass="bg-success"
                >
                        <p>Your new instructor request was successfully submitted. You will be 
                            notified by an admin once they have reviewed your information.</p>
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