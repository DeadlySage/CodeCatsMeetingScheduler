import React, { useState, useEffect  } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";


const AdvisorSelection = () => {
    const navigate = useNavigate();
    const handleAdvisorClick = (advisorName) => {
        navigate(`/advisor-calendar/${advisorName}`);
    }

    /* still working on showing data from "/api/course" to UI */
    // const [advisors, setAdvisors] = useState([]);
    // useEffect(() => {
    //     // Fetch advisors when the component mounts
    //     fetch("/api/course")
    //       .then((response) => {
    //         if (!response.ok) {
    //           throw new Error("Network response was not ok");
    //         }
    //         console.log(response);
    //         return response.json();
    //       })
    //       .then((data) => setAdvisors(data))
    //       .catch((error) => {
    //         console.error("Fetch error:", error);
    //         // Handle the error, e.g., display an error message to the user
    //       });
    //   }, []);
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