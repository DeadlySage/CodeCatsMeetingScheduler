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
        cookies.set('LoggedInUserId', response.loggedInUserId, { path: '/', expires: expirationDate });
    } else {
        throw new Error(response.message);
    }
}

export function logout() {
    cookies.remove('LoggedInUserId', { path: '/' });
}

export function isUserLoggedIn() {
    const loggedInUserId = cookies.get('LoggedInUserId');
    return !!loggedInUserId;
}