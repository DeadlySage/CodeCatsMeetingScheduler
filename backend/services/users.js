const axios = require("axios");

const UserRole = {
    student: 1,
    instructor: 2,
    admin: 3
}

function isEmptyOrSpaces(str) {
    return str == null || str.match(/^ *$/) !== null;
}

async function getSearchQuery(params) {
    const response = await axios.get("http://localhost:3001/users/");
    let allUsers = response.data;

    if(!isEmptyOrSpaces(params.firstName)){
        allUsers = allUsers.filter((u) => {
            return u.first_name.trim().toLowerCase() === params.firstName.trim().toLowerCase()
        });
    }
    if(!isEmptyOrSpaces(params.lastName)){
        allUsers = allUsers.filter((u) => {
            return u.last_name.trim().toLowerCase() === params.lastName.trim().toLowerCase()
        });    
    }
    if(!isEmptyOrSpaces(params.email)){
        allUsers = allUsers.filter((u) => {
            return u.email.trim().toLowerCase() === params.email.trim().toLowerCase()
        });
    }
    if(params.roleId){
        allUsers = allUsers.filter((u) => {
            return u.role_id === params.roleId;
        });    
    }
    return allUsers;
}

module.exports = {getSearchQuery};

