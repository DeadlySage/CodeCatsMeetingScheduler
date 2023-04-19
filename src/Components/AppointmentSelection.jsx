import React from "react";
import { Link } from "react-router-dom";

const AppointmentSelection = () => {
  return (
    <div className="appointment-selection-container">
      <h2>Appointment Selection Page</h2>
      {/* Your appointment selection logic and UI here */}
      <Link to="/home">
        <button>Go back to Home</button>
      </Link>
    </div>
  );
};

export default AppointmentSelection;
