import { jwtDecode } from "jwt-decode";
import { DecodedToken, User } from "./types";

export function GetUserData(): User | null {
    const token = localStorage.getItem('token');
    if (!token) {
        return null;
    }
    try {
        const decodedToken = jwtDecode<DecodedToken>(token);

        if (!decodedToken.userdata) {
            localStorage.removeItem('token');
            return null;
        }

        const userdata = decodedToken.userdata;
        return userdata;
    } catch (error) {
        console.error("Error decoding token:", error);
        localStorage.removeItem('token');
        return null;
    }
}