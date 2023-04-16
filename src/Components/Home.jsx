import React, { useState } from "react";
import { Link } from 'react-router-dom';

const Home = () => {

    return (
        <div className="auth-form-container"
            style={{ display: "flex", justifyContent: "top", padding: "30px 30px" }}
            >
            <h2>Are you a student or an instructor?</h2>
            <div className="button-container"
                style={{ display: "flex", justifyContent: "center", gap: "10px", flexDirection: "row", alignItems: "flex-start" }}
            >
                
                <button className="button" style={{ padding: "20px 50px" }}>Student</button>
                <button className="button" style={{ padding: "20px 50px" }}>Instructor</button>
            </div>
        </div>
    )
}

export default Home;