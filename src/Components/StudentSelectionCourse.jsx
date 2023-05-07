import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const StudentSelectionCourse = () => {
    const navigate = useNavigate();
    const handleCourseClick = (courseId) => {
        //navigate(`/course/${courseId}`);
        navigate(`/advisor-selection`);
    }

    return (
        <div className="auth-form-container"
            style={{ display: "flex", justifyContent: "top", padding: "30px 30px" }}
            >
            <h3>Select Course</h3>
            <div className="button-container"
                style={{ display: "flex", justifyContent: "center", gap: "20px", flexDirection: "row", alignItems: "flex-start", marginTop: "15px" }}
            >
                <button className="button rounded" style={{ padding: "18px 36px", fontSize: "19px" }} onClick={() => handleCourseClick("CSC190")}>CSC 190</button>
                <button className="button rounded" style={{ padding: "18px 36px", fontSize: "19px" }} onClick={() => handleCourseClick("CSC191")}>CSC 191</button>
            </div>
        </div>
    )
}

export default StudentSelectionCourse;