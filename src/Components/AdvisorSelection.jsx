import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AdvisorSelection = () => {
    const navigate = useNavigate();
    const handleAdvisorClick = (advisorName) => {
        navigate(`/calendar/${advisorName}`);
    }

    return (
        <div className="auth-form-container"
            style={{ display: "flex", justifyContent: "top", padding: " 25px 25px 50px 25px" }}
            >
            <h3>Instructors / Lab Advisors</h3>

            <div className="button-container"
                style={{ display: "flex", justifyContent: "center", gap: "20px", flexDirection: "row", alignItems: "flex-start", marginTop: "15px" }}
            >
                <button className="button rounded" style={{ width: "300px", fontSize: "20px" }} onClick={() => handleAdvisorClick("Kenneth-Elliott")}>Kenneth Elliott</button>
            </div>

            <div className="button-container"
                style={{ display: "flex", justifyContent: "center", gap: "20px", flexDirection: "row", alignItems: "flex-start", marginTop: "15px" }}
            >
                <button className="button rounded" style={{ width: "300px", fontSize: "20px" }} onClick={() => handleAdvisorClick("Yu-Chen")}>Yu Chen</button>
            </div>

            <div className="button-container"
                style={{ display: "flex", justifyContent: "center", gap: "20px", flexDirection: "row", alignItems: "flex-start", marginTop: "15px" }}
            >
                <button className="button rounded" style={{ width: "300px", fontSize: "20px" }} onClick={() => handleAdvisorClick("SpongeBob-Squarepants")}>SpongeBob Squarepants</button>
            </div>

            <div className="button-container"
                style={{ display: "flex", justifyContent: "center", gap: "20px", flexDirection: "row", alignItems: "flex-start", marginTop: "15px" }}
            >
                <button className="button rounded" style={{ width: "300px", fontSize: "20px" }} onClick={() => handleAdvisorClick("Patrick-Star")}>Patrick Star</button>
            </div>
        </div>
    )
}

export default AdvisorSelection;