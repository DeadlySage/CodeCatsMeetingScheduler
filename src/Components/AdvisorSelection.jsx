import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const AdvisorSelection = () => {
    const navigate = useNavigate();
    

    /* 
    Michael Lawler - 10.1.23
    
    GOAL:
    // advisor selection with list buttons with instructors in database
    
    PREVIEW
    dynamically populate view with a button for each advisor
    that is returned in the get request w/ the button label
    being the user's first and last name

    NOTE:
    code builds and runs
    need to do more work on users part of database and how it handles
    so we can effectively retrieve users from DB that has the
    appropriate roles

    START
    */
    
    const [advisors, setAdvisors] = useState([]);
    
    // get request to fetch users with role of instructor, admin
    // adjust endpoint url that returns desired users
    useEffect(() => {
        fetch("/api/users")
           .then((response) => {
             if (!response.ok) {
               throw new Error("Network response was not ok");
             }
             return response.json();
           })
           .then((data) => {
                // filter users by role and format name
                const instructorAdminUsers = data.filter(
                    user => user.role_id === 'instructor' || user.role_id === 'admin'
                ).map(user => ({
                    // format name as "Last, First"
                    name: `${user.last_name}, ${user.first_name}`,
                    // create a route for each user
                    route: `/${user.last_name}_${user.first_name}`
                }));
                setAdvisors(instructorAdminUsers);
           })
           .catch((error) => {
                console.error("Fetch error:", error);
           });
       }, []);

    const handleAdvisorClick = (advisorName) => {
        navigate(`/advisor-calendar/${advisorName}`);
    }

    // END of Michael Lawler - 10.1.23
    /************************************************************/
    
    return (
        <div className="auth-form-container"
            style={{ display: "flex", justifyContent: "top", padding: " 25px 25px 50px 25px" }}
            >
            <h3>Instructors / Lab Advisors</h3>

            <Link to="/Kenneth_Elliot" style={{textDecoration:'none'}}>
            <div className="button-container"
                
                    style={{ display: "flex", justifyContent: "center", gap: "20px", flexDirection: "row", alignItems: "flex-start", marginTop: "15px" }}
                >   
                    <button className="button rounded" style={{ width: "300px", fontSize: "20px" }} >Kenneth Elliott</button>
                </div>
            </Link>

            <Link to="/Yu_Chen"style={{textDecoration:'none'}}>
            <div className="button-container"
                style={{ display: "flex", justifyContent: "center", gap: "20px", flexDirection: "row", alignItems: "flex-start", marginTop: "15px" }}
            >
                <button className="button rounded" style={{ width: "300px", fontSize: "20px" }} onClick={() => handleAdvisorClick("Yu_Chen")}>Yu Chen</button>
            </div>
            </Link>

            <Link to="/SpongeBob_Squarepants"style={{textDecoration:'none'}}>
            <div className="button-container"
                style={{ display: "flex", justifyContent: "center", gap: "20px", flexDirection: "row", alignItems: "flex-start", marginTop: "15px" }}
            >
                <button className="button rounded" style={{ width: "300px", fontSize: "20px" }} onClick={() => handleAdvisorClick("SpongeBob_Squarepants")}>SpongeBob Squarepants</button>
            </div>
            </Link>

            <Link to="/Patrick_Star"style={{textDecoration:'none'}}>
            <div className="button-container"
                style={{ display: "flex", justifyContent: "center", gap: "20px", flexDirection: "row", alignItems: "flex-start", marginTop: "15px" }}
            >
                <button className="button rounded" style={{ width: "300px", fontSize: "20px" }} onClick={() => handleAdvisorClick("Patrick_Star")}>Patrick Star</button>
            </div>
            </Link>
        </div>
    )
}

export default AdvisorSelection;
