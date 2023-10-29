import React, { useState, } from "react";
import { Link, useNavigate } from 'react-router-dom';
import CustomModal from "./CustomModal";
import { getLoggedInUser } from '../AuthService';

export const UserSettings = () => {
    const [errors, setErrors] = useState([]);
    const navigate = useNavigate();
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const loggedInUser = getLoggedInUser();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formErrors = handleFormValidation();
        if (formErrors.length === 0) {
            try {
                setIsLoading(true);
                handleRedirectToCalendar();
            } catch (err) {
                setErrors([err.response.data.message]);
                setShowErrorModal(true);
            } finally {
                setIsLoading(false);
            }
        } else {
            setShowErrorModal(true);
        }
    }

    const handleCloseErrorModal = () => {
        setShowErrorModal(false);
    }

    const handleRedirectToCalendar = () => {
        navigate("/calendar", { replace: true })
    }

    const handleFormValidation = () => {
        const result = [];

        setErrors(result);
        return result;
    };

    return (
        <div className="col-xl-3 col-md-5 col-10 mx-auto">
            <div className="row" style={{textAlign: "center", marginTop: 20}}>
                <h2>User Settings</h2>
            </div>
            {/* {showErrorModal && (
                <CustomModal
                    title={
                        <div style={{ color: "white" }}>
                            <i className="mdi mdi-alert-circle-outline"></i>
                            {" Error"}
                        </div>}
                    isOpen={showErrorModal}
                    toggle={handleCloseErrorModal}
                    headerBackgroundClass="bg-danger"
                >
                    <ul>
                        {errors.map((error, i) => (
                            <li key={i}>{error}</li>
                        ))}
                    </ul>
                </CustomModal>
            )}
            {showAccountPendingModal && (
                <CustomModal
                    title={
                        <div style={{ color: "white" }}>
                            <i className="mdi mdi-alert-circle-outline"></i>
                            {" Account Still Pending"}
                        </div>}
                    isOpen={showAccountPendingModal}
                    toggle={handleCloseAccountPendingModal}
                    headerBackgroundClass="bg-warning"
                >
                    <p>Your account is still under review, please try again later.</p>
                </CustomModal>
            )} */}
            {isLoading && (
                <div className="loading-overlay">
                    <div className="loading-spinner">
                        <div className="spinner"></div>
                    </div>
                </div>
            )}
        </div>
    )
}