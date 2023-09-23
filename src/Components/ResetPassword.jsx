import React, { useState } from "react";
import { Link } from 'react-router-dom';

export const ResetPassword = (props) => {
    const [email, setEmail] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
    }

    return (
        <div className="auth-form-container">
            <h2>Reset Password</h2>
        </div>
    )
}

export default ResetPassword;