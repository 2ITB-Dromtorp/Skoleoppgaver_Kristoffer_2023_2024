import { jwtDecode } from "jwt-decode";

export function GetUserData(navigate) {
    const token = localStorage.getItem('token');
    if (!token) {
        return null;
    }
    try {
        const decodedToken = jwtDecode(token);

        if (!decodedToken.userdata) {
            localStorage.removeItem('token');
            return null
        }

        if (Date.now() >= decodedToken.exp * 1000) {
            localStorage.removeItem('token');
            return null
        }

        const userdata = decodedToken.userdata;
        return userdata;
    } catch (error) {
        console.error("Error decoding token:", error);
        localStorage.removeItem('token');
        return null;
    }
}