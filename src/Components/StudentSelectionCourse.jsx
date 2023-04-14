import React, { useState } from "react";
import { Link } from 'react-router-dom';

const StudentSelectionCourse = () => {

    return (
        <div className="auth-form-container"
            style={{ display: "flex", justifyContent: "top", padding: "30px 30px" }}
            >
            <h2>Select Course</h2>
            <div className="button-container"
                style={{ display: "flex", justifyContent: "center", gap: "10px", flexDirection: "row", alignItems: "flex-start" }}
            >
                
                <button className="button" style={{ padding: "20px 50px" }}>CSC 190</button>
                <button className="button" style={{ padding: "20px 50px" }}>CSC 191</button>
            </div>
        </div>
    )
}

export default StudentSelectionCourse;