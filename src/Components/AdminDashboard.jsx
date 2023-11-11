import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CustomModal from './CustomModal'; 
import './AdminDashboard.css';
import { IconContext } from 'react-icons';
import { FaTrash, FaRegEdit } from 'react-icons/fa';
import { BsCheckLg } from 'react-icons/bs';
import { AiOutlineClose } from 'react-icons/ai';
import { getLoggedInUserId } from '../AuthService';
import AdminUserUpdateModal from './AdminUserUpdateModal';

const userRoleType = {
    1: 'Student',
    2: 'Instructor',
    3: 'Admin',
};

const userStatus = {
    1: 'Pending',
    2: 'Approved'
};

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleSortOrder, setRoleSortOrder] = useState('asc');
    const [lastLoggedInSortOrder, setLastLoggedInSortOrder] = useState('asc');
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [showDeclineConfirmation, setShowDeclineConfirmation] = useState(false);
    const [showEditConfirmation, setShowEditConfirmation] = useState(false);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedUserFirstName, setSelectedUserFirstName] = useState('');
    const [selectedUserLastName, setSelectedUserLastName] = useState('');
    const [showSuccessBanner, setShowSuccessBanner] = useState(false);

    // Get user data from the server
    useEffect(() => {
        axios.get('/api/users/')
        .then((response) => {setUsers(response.data); })
        .catch((error) => {console.error('Error fetching users:', error);});
    },[]);

    const pendingUsers = users.filter((user) => user.status_id === 1);

    const filteredUsers = users.filter((user) => {
        return (
        user.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
    });

    const sortUsersByRole = () => {
        // Toggles between asc and desc order.
        const newSortOrder = roleSortOrder === 'asc' ? 'desc' : 'asc';
        setRoleSortOrder(newSortOrder);

        // Sorts users based on roleid value.
        const sortedUsers = [...filteredUsers].sort((a,b) =>{
            if (roleSortOrder === 'asc'){
                return a.role_id - b.role_id;
            }else{
                return b.role_id - a.role_id;
            }
        });
        setUsers(sortedUsers);
    };

    const sortUsersByLastLoggedIn = () => {
        // Toggles between asc and desc order.
        const newSortOrder = lastLoggedInSortOrder === 'asc' ? 'desc' : 'asc';
        setLastLoggedInSortOrder(newSortOrder);
      
        // Sorts users based on last_logged_in value.
        const sortedUsers = [...filteredUsers].sort((a, b) => {
            const dateA = a.last_logged_in || 0; // Handle the case where last_logged_in is null
            const dateB = b.last_logged_in || 0;
        
            if (lastLoggedInSortOrder === 'asc') {
                return dateA - dateB;
            } else {
                return dateB - dateA;
            }
        });
      
        setUsers(sortedUsers);
    };

    const handleInstructorAction = (userId, firstName, lastName, action) => {
        setSelectedUserId(userId);
        setSelectedUserFirstName(firstName);
        setSelectedUserLastName(lastName);
        
        if (action === 'approve') {
            setShowConfirmation(true);
        } else if (action === 'decline') {
            setShowDeclineConfirmation(true);
        } else if (action === 'delete') {
            setShowDeleteConfirmation(true);
        }
    };

    const handleUserEdit = (user) => {
        setSelectedUser(user);
        setShowEditConfirmation(true);
    };

    const confirmAuthorization = () => {
        if (selectedUserId) {
            axios.patch(`/api/users/${selectedUserId}`, { statusId: 2 }) // Set statusId to 2 for "Approve"
                .then((response) => {
                    const updatedUsers = users.map((user) => {
                        if (user._id === selectedUserId) {
                            console.log('Patch Successful');
                            return { ...user, status_id: 2 };
                        }
                        else{
                            console.error('Error approving user:', response.data);
                        }
                        return user;
                    });
                    setUsers(updatedUsers);
                })
                .catch((error) => {
                    console.error('Error authorizing to Instructor account', error);
                });
        }
    
        // Close the modal
        setShowConfirmation(false);
    };

    const handleEditConfimation = () => {
        axios.get('/api/users/')
        .then((response) => {
            setUsers(response.data); 
            setShowEditConfirmation(false);
            setShowSuccessBanner(true);
        })
        .catch((error) => {console.error('Error fetching users:', error);});
    }

    const confirmUserDeletion = () => {
        if (selectedUserId) {
          // Make an API request to delete the user
          axios.delete(`/api/users/${selectedUserId}`)
            .then((response) => {
              // Update list after deletion
              const updatedUsers = users.filter((user) => user._id !== selectedUserId);
              setUsers(updatedUsers);
              closeAllModals();
              console.log('User delete success');
            })
            .catch((error) => {
              console.error('Error deleting user', error);
              setShowDeleteConfirmation(false);
            });
        }
      };
      

    const closeAllModals = () => {
        // Close the modal
        setShowConfirmation(false);
        setShowDeclineConfirmation(false);
        setShowDeleteConfirmation(false);
        setShowEditConfirmation(false);
    };

return (
    <div>
        <div style={{display: 'flex', justifyContent: 'center'}}>
            {showSuccessBanner && (
                <div className="alert alert-success fade show text-align-left"
                    style={{width: '60%', maxWidth: '100%'}}
                >
                    Changes saved successfully!
                    <button type="button" className="close close-button" data-dismiss="alert" aria-label="Close" onClick={() => setShowSuccessBanner(false)}>
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
            )}
        </div>

        {pendingUsers.length > 0 && (
            <div>
                <div className="table-container" 
                    style={{ 
                        overflow: 'auto',
                        maxHeight: '500px',
                        borderRadius: '15px'
                    }} 
                >
                    <h2>Pending Instructors</h2>
                    <table className="user-table">
                        <thead>
                            <tr>
                                <th>First Name</th>
                                <th>Last Name</th>
                                <th>Email</th>
                                <th>Status</th>
                                <th>Authorize</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pendingUsers.map((user) => (
                                <tr key={user._id}>
                                    <td>{user.first_name}</td>
                                    <td>{user.last_name}</td>
                                    <td>{user.email}</td>
                                    <td>{userStatus[user.status_id]}</td>
                                    <td>
                                        {user.status_id === 1 && (
                                        <div>
                                            <button 
                                                className="authorize-button"
                                                onClick={() => handleInstructorAction(
                                                user._id,
                                                user.first_name,
                                                user.last_name,
                                                'approve')}
                                            >
                                                <BsCheckLg />
                                            </button>
                                            <button 
                                                className="decline-button"
                                                onClick={() => handleInstructorAction(
                                                user._id,
                                                user.first_name,
                                                user.last_name,
                                                'decline')}
                                            >
                                                <AiOutlineClose />
                                            </button>
                                        </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                    
                <div style={{ margin: '30px' }}></div> {/* Add gap between tables */}
            </div>
        )}

        {showConfirmation && (
            <CustomModal
                title="Approve User"
                isOpen={showConfirmation}
                toggle={closeAllModals}
                onCancel={closeAllModals}
                onSubmit={confirmAuthorization}
                submitText="Approve User"
                >
                <p>Are you sure you want to approve {' '}
                    <strong>{selectedUserFirstName}{' '}{selectedUserLastName}</strong>
                    {' '} to be an Instructor?</p>
            </CustomModal>
        )}

        {showDeclineConfirmation && (
            <CustomModal
                title="Decline/Delete User"
                isOpen={showDeclineConfirmation }
                toggle={closeAllModals}
                onCancel={closeAllModals}
                onDelete={confirmUserDeletion}
                deleteText="Decline User"
                >
                <p>Are you sure you want to decline {' '}
                    <strong>{selectedUserFirstName}{' '}{selectedUserLastName}</strong>
                    {' '} to be an Instructor? <strong>This will delete the account</strong>.</p>
            </CustomModal>
        )}

        {showEditConfirmation && (
            <AdminUserUpdateModal
                isOpen={showEditConfirmation}
                toggle={closeAllModals}
                onCancel={closeAllModals}
                onSubmit={handleEditConfimation}
                user={selectedUser}
            />
        )}

        {showDeleteConfirmation && (
            <CustomModal
            title="Delete User"
            isOpen={showDeleteConfirmation}
                toggle={closeAllModals}
                onCancel={closeAllModals}
                onDelete={confirmUserDeletion}
                deleteText="Delete User"
            >
            <p>Are you sure you want to delete the user: {' '}
                <strong>{selectedUserFirstName} {selectedUserLastName}</strong>?</p>
            </CustomModal>
        )}


        <div className="table-container" 
            style={{ overflow: 'auto', maxHeight: '1000px', borderRadius: '15px' }}
        >
            <h2>All Users</h2>
            <div className='row col-md-10'>
                <div>
                    <input className="user-searchbar"
                        type="text"
                        placeholder="Search by name/email"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div> 
            
            <div style={{margin:'10px'}}></div> {/* Add gap under search bar & button */}

            <table className="user-table">
                <thead>
                    <tr>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Email</th>
                        <th className='th-sortable' onClick={sortUsersByRole}>
                            Role {roleSortOrder === 'asc' ? '▲' : '▼'}
                        </th>
                        <th className='th-sortable' onClick={sortUsersByLastLoggedIn}>
                            Last Login {lastLoggedInSortOrder === 'asc' ? '▲' : '▼'}
                        </th>
                        <th>Edit / Delete</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredUsers.map((user) => (
                    <tr key={user._id}>
                        <td>{user.first_name}</td>
                        <td>{user.last_name}</td>
                        <td>{user.email}</td>
                        <td>{userRoleType[user.role_id]}</td>
                        <td>
                            {user.last_logged_in
                                ? new Date(user.last_logged_in).toLocaleDateString('en-US')
                                : 'Never'}
                            </td>
                        <td>
                            {getLoggedInUserId() !== user._id && (
                                <div>
                                    <IconContext.Provider value={{color: 'white'}}>
                                        <button 
                                            className='edit-button'
                                            onClick={() => handleUserEdit(user)}
                                        >
                                            <FaRegEdit/>
                                        </button>
                                    </IconContext.Provider>
                                    <IconContext.Provider value={{color: 'white'}}>
                                        <button 
                                            className='delete-button'
                                            onClick={() => handleInstructorAction(
                                            user._id,
                                            user.first_name,
                                            user.last_name,
                                            'delete')}
                                        >
                                            <FaTrash/>
                                        </button>
                                    </IconContext.Provider>
                                </div>
                            )}
                        </td>
                    </tr>
                    ))}
                </tbody>
            </table>
        </div>  
        <div style={{ margin: '30px' }}></div> {/* Add gap table and page bottom*/}
    </div>
  );
}

export default AdminDashboard;
