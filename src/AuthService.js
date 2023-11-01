import Cookies from 'universal-cookie';
import axios from 'axios';
const cookies = new Cookies();

export async function login(email, password) {
    logout()
    const response = await axios.get('/login', {
        params: {
            email: encodeURIComponent(email),
            password: encodeURIComponent(password)
        }
    });
    if (response.status === 200) {
        const expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() + 200); // Expires in 200 days
        cookies.set('LoggedInUserId', response.data.loggedInUserId, { path: '/', expires: expirationDate });
    } else {
        throw new Error(response.message);
    }
}

export function logout() {
    cookies.remove('LoggedInUserId', { path: '/' });
}

export function isUserLoggedIn() {
    return getLoggedInUserId() !== undefined;
}

export async function getLoggedInUser() {
    if(isUserLoggedIn()) {
        const loggedInUser = await axios.get('/users/' + getLoggedInUserId());
        return loggedInUser.data;
    }
}

export function getLoggedInUserId() {
    const userId = cookies.get('LoggedInUserId');
    return userId;
}

export async function getLoggedInUserRole() {
    const user = await getLoggedInUser();
    return user ? user.role_id : null;
}

export async function isUserAdmin() {
    const user = await getLoggedInUser();
    console.log(user && user.role_id === 3);
    return user && user.role_id === 3; // Check if user is defined and has the admin role
  }