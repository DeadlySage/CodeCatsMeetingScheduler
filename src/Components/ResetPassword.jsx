import React, { useState } from "react";
import { Link } from 'react-router-dom';

export const ResetPassword = (props) => {
    const [email, setEmail] = useState('');
    const [securityQuestion1, setSecurityQuestion1] = useState('');
    const [securityAnswer1, setSecurityAnswer1] = useState('');
    const [securityQuestion2, setSecurityQuestion2] = useState('');
    const [securityAnswer2, setSecurityAnswer2] = useState('');
    const [securityQuestion3, setSecurityQuestion3] = useState('');
    const [securityAnswer3, setSecurityAnswer3] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const securityQuestions = [
        "What is your mother's maiden name?",
        "What was the name of your first pet?",
        "In what city were you born?",
        "What high school did you attend?",
        "What was the make of your first car?",
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        if (email === 'user@example.com' && securityAnswer1 === 'answer1' && securityAnswer2 === 'answer2') {
        } else {
            setErrorMessage('The answers you provided do not match our records. Please double-check your information.');
        }
    }

    return (
        <div className="auth-form-container">
            <h2>Reset Password</h2>
            <form onSubmit={handleSubmit}>
                <label htmlFor="email">Email:</label>
                <input type="email" id="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} required /><br />

                <div>
                    <label htmlFor="securityQuestion1">Security Question 1:</label>
                    <select
                        id="securityQuestion1"
                        name="securityQuestion1"
                        value={securityQuestion1}
                        onChange={(e) => setSecurityQuestion1(e.target.value)}
                        required
                    >
                        <option value="" disabled>Select a security question</option>
                        {securityQuestions.map((question, index) => (
                            <option key={index} value={question}>
                                {question}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label htmlFor="securityAnswer1">Answer 1:</label>
                    <input type="text" id="securityAnswer1" name="securityAnswer1" value={securityAnswer1} onChange={(e) => setSecurityAnswer1(e.target.value)} required />
                </div>

                <div>
                    <label htmlFor="securityQuestion2">Security Question 2:</label>
                    <select
                        id="securityQuestion2"
                        name="securityQuestion2"
                        value={securityQuestion2}
                        onChange={(e) => setSecurityQuestion2(e.target.value)}
                        required
                    >
                        <option value="" disabled>Select a security question</option>
                        {securityQuestions.map((question, index) => (
                            <option key={index} value={question}>
                                {question}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label htmlFor="securityAnswer2">Answer 2:</label>
                    <input type="text" id="securityAnswer2" name="securityAnswer2" value={securityAnswer2} onChange={(e) => setSecurityAnswer2(e.target.value)} required />
                </div>

                <div>
                    <label htmlFor="securityQuestion3">Security Question 2:</label>
                    <select
                        id="securityQuestion3"
                        name="securityQuestion3"
                        value={securityQuestion3}
                        onChange={(e) => setSecurityQuestion3(e.target.value)}
                        required
                    >
                        <option value="" disabled>Select a security question</option>
                        {securityQuestions.map((question, index) => (
                            <option key={index} value={question}>
                                {question}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label htmlFor="securityAnswer3">Answer 3:</label>
                    <input type="text" id="securityAnswer3" name="securityAnswer2" value={securityAnswer3} onChange={(e) => setSecurityAnswer3(e.target.value)} required />
                </div>


                {/* Display error message */}
                {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}

                <button type="submit">Reset Password</button>
            </form>

            <p>If you need assistance, please contact the admin at <a href="mailto:admin@example.com">codecatsadmin.com</a>.</p>
        </div>
    )
}

export default ResetPassword;
