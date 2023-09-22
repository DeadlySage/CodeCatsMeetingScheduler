import React from "react";
import { Link } from 'react-router-dom';

export const AccountCreatedModal = () => {
    return (
        <div className="modalBackground">
            <div className="modalContainer">
                <div className="title">
                    <h2>Account Created Successfully!</h2>
                </div>
                <div className="body">
                    <p>You may now proceed to the login page.</p>
                </div>
                <div className="footer">
                    <Link to="/login">
                    <button className="button rounded" style={{ width: "50%", marginTop: "30px" }}>Continue</button>
                    </Link>
                </div>
            </div>
        </div>
    );
};