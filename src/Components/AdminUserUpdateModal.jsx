import React, {useState} from 'react';
import CustomModal from './CustomModal';
import {UserRoleId} from './Constants';
import Select from 'react-select';
import axios from 'axios';
import bcrypt from 'bcryptjs';

export default function AdminUserUpdateModal({
    isOpen,
    toggle,
    onCancel,
    onSubmit,
    user
}) {
    const [selectedRoleId, setSelectedRoleId] = useState(user.role_id);
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState(null);
    const [roles, setRoles] = useState([
        {value: '1', label: 'Student'},
        {value: '2', label: 'Instructor'},
        {value: '3', label: 'Admin'},
    ]);

    const handleSubmit = async () => {
        let params = {roleId: selectedRoleId};
        if(password){
            const hashedPassword = await bcrypt.hash(password, 10);
            params.password = hashedPassword;
        }
        
        axios.patch(`/users/${user._id}`, params)
        .then(function (response) {
            onSubmit();
        })
        .catch(function (error) {
            setError(error.message)
        });
    }

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return(
        <CustomModal
            title= {
                <div>
                    <i className="bi bi-person-gear"></i>
                    {' Edit '}{UserRoleId[user.role_id]}: {user.first_name} {user.last_name}
                </div>
            }
            isOpen={isOpen}
            toggle={toggle}
            onCancel={onCancel}
            onSubmit={handleSubmit}
            submitText={"Save"}
        >
            <div>
                {error && (
                    <div className="alert alert-danger">
                        <strong>{error}</strong>
                    </div>
                )}
                <div style={{justifyContent: 'left'}}>
                    <div className="row" style={{textAlign: "left"}}>
                        <div className="col">
                            <label htmlFor="roleId" className="role-label">
                                Role
                            </label>
                        </div>
                        <div className="col">
                            <label htmlFor="password" className="password-label">
                                Password
                            </label>
                        </div>
                    </div>
                    <div className="row">
                        <div className='col'>
                            <Select
                                style={{ float: 'left'}}
                                defaultValue={roles[user.role_id - 1]}
                                options={roles}
                                onChange={(e) => setSelectedRoleId(e.value)}
                            />
                        </div>
                        <div className="col">
                            <div className="container">
                                <div className="row" style={{
                                    outlineColor: 'hsl(0, 0%, 80%)',
                                    outlineWidth: '1px',
                                    outlineStyle: 'solid',
                                    borderRadius: '4px'
                                }}>
                                    <input 
                                        value={password} 
                                        onChange={(e) => setPassword(e.target.value)} 
                                        type={showPassword ? "text" : "password"} 
                                        placeholder={showPassword ? "Enter password" : "********"} 
                                        id="password" 
                                        name="password" 
                                        style={{outline: 'some'}}
                                        className="col-md-10 col-10"
                                    />
                                    <button
                                        type="button"
                                        onClick={togglePasswordVisibility}
                                        className="password-toggle-button col-md-2 col-2"
                                    >
                                    {showPassword ? 
                                        <i className="bi bi-eye" id="passwordIcon"></i> : 
                                        <i className="bi bi-eye-slash" id="passwordIcon"></i>}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </CustomModal>
    );
}