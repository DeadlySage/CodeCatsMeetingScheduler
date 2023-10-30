import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CustomModal from './CustomModal'; 
import './AdminDashboard.css';
import { IconContext } from 'react-icons';
import { FaTrash } from 'react-icons/fa';

const userRoleType = {
    1: 'Student',
    2: 'Instructor',
    3: 'Admin',
};

const userStatus = {
    1: 'Pending',
    2: 'Approved',
    3: 'Declined'
};

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOrder, setSortOrder] = useState('asc');
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [showDeclineConfirmation, setShowDeclineConfirmation] = useState(false);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [selectedUserFirstName, setSelectedUserFirstName] = useState('');
    const [selectedUserLastName, setSelectedUserLastName] = useState('');

    // Get user data from the server
    useEffect(() => {
        axios.get('/users/')
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

    const sortUsers = () => {
        // Toggles between asc and desc order.
        const newSortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
        setSortOrder(newSortOrder);

        // Sorts users based on roleid value.
        const sortedUsers = [...filteredUsers].sort((a,b) =>{
            if (sortOrder === 'asc'){
                return a.role_id - b.role_id;
            }else{
                return b.role_id - a.role_id;
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

    const confirmAuthorization = () => {
        if (selectedUserId) {
            console.log('Selected User ID:', selectedUserId); // Log the selected user's ID
            axios.patch(`/users/${selectedUserId}`, { statusId: 2 }) // Set statusId to 2 for "Approve"
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
    
    const declineAuthorization = () => {
        if (selectedUserId) {
            console.log('Selected User ID:', selectedUserId); // Log the selected user's ID
            axios.patch(`/users/${selectedUserId}`, { statusId: 3 }) // Set statusId to 3 for "Declined"
                .then((response) => {
                    const updatedUsers = users.map((user) => {
                        if (user._id === selectedUserId) {
                            console.log('Patch Successful');
                            return { ...user, status_id: 3 }; 
                        }
                        else{
                            console.error('Error declining user:', response.data);
                        }
                        return user;
                });
                setUsers(updatedUsers);
            })
            .catch((error) => {
                console.error('Error declining', error);
            });
        }
         // Close the modal
         setShowDeclineConfirmation(false);
    };

    const confirmUserDeletion = () => {
        if (selectedUserId) {
            console.log('Selected User ID:', selectedUserId); // Log the selected user's ID
          // Make an API request to delete the user
          axios.delete(`/users/${selectedUserId}`)
            .then((response) => {
              // Update list after deletion
              const updatedUsers = users.filter((user) => user._id !== selectedUserId);
              setUsers(updatedUsers);
              setShowDeleteConfirmation(false);
              console.log('User delete success');
            })
            .catch((error) => {
              console.error('Error deleting user', error);
              setShowDeleteConfirmation(false);
            });
        }
      };
      

    const cancelAction = () => {
        // Close the modal
        setShowConfirmation(false);
        setShowDeclineConfirmation(false);
        setShowDeleteConfirmation(false);

    };

return (
    <div>
        <header className="admin-header">
            <h1>Admin Dashboard</h1>
        </header>
        
        <div style={{ margin: '75px' }}></div>

        <div className="table-container" 
        style={{ overflow: 'auto', maxHeight: '500px', borderRadius: '15px' }} >
        <h1>Pending Instructors</h1>
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
                                Approve
                            </button>
                            <button 
                                className="decline-button"
                                onClick={() => handleInstructorAction(
                                user._id,
                                user.first_name,
                                user.last_name,
                                'decline')}
                            >
                                Decline
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

    {showConfirmation && (
        <CustomModal
            title="Approve User"
            isOpen={showConfirmation}
            toggle={cancelAction}
            onCancel={cancelAction}
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
            title="Decline User"
            isOpen={showDeclineConfirmation }
            toggle={cancelAction}
            onCancel={cancelAction}
            onSubmit={declineAuthorization}
            submitText="Decline User"
            >
            <p>Are you sure you want to decline {' '}
                <strong>{selectedUserFirstName}{' '}{selectedUserLastName}</strong>
                {' '} to be an Instructor?</p>
        </CustomModal>
    )}

    {showDeleteConfirmation && (
        <CustomModal
          title="Delete User"
         isOpen={showDeleteConfirmation}
            toggle={cancelAction}
            onCancel={cancelAction}
            onSubmit={confirmUserDeletion}
            submitText="Delete User"
        >
        <p>Are you sure you want to delete the user: {' '}
            <strong>{selectedUserFirstName} {selectedUserLastName}</strong>?</p>
        </CustomModal>
    )}


    <div className="table-container" 
        style={{ overflow: 'auto', maxHeight: '1000px', borderRadius: '15px' }}>
        <h1>All Users</h1>    
        <input className="user-searchbar"
            type="text"
            placeholder="Search by name/email"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            
        />
        <button 
            className ="sort-button"
            onClick={sortUsers}
            style={{borderRadius: '5px'}}>
            Sort by User Role {sortOrder === 'asc' ? '▲' : '▼'}
        </button>

    <div style={{margin:'10px'}}></div> {/* Add gap under search bar & button */}

        <table className="user-table">
            <thead>
                <tr>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                {filteredUsers.map((user) => (
                <tr key={user._id}>
                    <td>{user.first_name}</td>
                    <td>{user.last_name}</td>
                    <td>{user.email}</td>
                    <td>{userRoleType[user.role_id]}</td>
                    <td>{userStatus[user.status_id]}</td>
                    <td>
                        <IconContext.Provider value={{color: 'white'}}>
                        <button 
                            onClick={() => handleInstructorAction(
                            user._id,
                            user.first_name,
                            user.last_name,
                            'delete')}
                        >
                            <FaTrash/>
                        </button>
                        </IconContext.Provider>
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
