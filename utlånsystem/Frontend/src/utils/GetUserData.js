import { jwtDecode } from "jwt-decode";

export function GetUserData(navigate) {
    
    const token = localStorage.getItem('token');
    if (!token) {
        navigate('/login');
        return null; 
    }

    const decodedToken = jwtDecode(token)
    const userdata = decodedToken.userdata;

    console.log(userdata)

    return userdata;
}