import React, { useState } from "react";
import { Link } from 'react-router-dom';

export const Security = (props) => {

    const handleSubmit = (e) => {
        e.preventDefault();
    }

    return (
        <body>
            <h1>Security Questions</h1>
            <form action="process_security_questions.php" method="post">
                <div class="question">
                    <label for="question1">Question 1:</label>
                    <select id="question1" name="question1" required>
                        <option value="" disabled selected>Select a question</option>
                        <option value="color">What is your favorite color?</option>
                        <option value="pet">What is the name of your first pet?</option>
                        <option value="birthplace">Where were you born?</option>
                    </select>
                    <input type="text" id="answer1" name="answer1" placeholder="Your answer" required></input>
                </div>
                <div class="question">
                    <label for="question2">Question 2:</label>
                    <select id="question2" name="question2" required>
                        <option value="" disabled selected>Select a question</option>
                        <option value="color">What is your favorite color?</option>
                        <option value="pet">What is the name of your first pet?</option>
                        <option value="birthplace">Where were you born?</option>
                    </select>
                    <input type="text" id="answer2" name="answer2" placeholder="Your answer" required></input>
                </div>
                <div class="question">
                    <label for="question3">Question 3:</label>
                    <select id="question3" name="question3" required>
                        <option value="" disabled selected>Select a question</option>
                        <option value="color">What is your favorite color?</option>
                        <option value="pet">What is the name of your first pet?</option>
                        <option value="birthplace">Where were you born?</option>
                    </select>
                    <input type="text" id="answer3" name="answer3" placeholder="Your answer" required></input>
                </div>
                <div class="password">
                    <label for="newPassword">New Password:</label>
                    <input type="password" id="newPassword" name="newPassword" placeholder="Enter your new password" required></input>
                </div>
                <div class="password">
                    <label for="confirmPassword">Confirm New Password:</label>
                    <input type="password" id="confirmPassword" name="confirmPassword" placeholder="Confirm your new password" required></input>
                </div>
                <Link to="/Login">
                    <button type="submit">Submit</button>
                </Link>
            </form>
        </body>
    )
}

export default Security;