import { jwtDecode } from "jwt-decode";
import { User } from "./types.ts";

export function GetUserData(): User | null {
    const token = localStorage.getItem('token');
    if (!token) {
        return null;
    }
    try {
        const decodedToken: { userdata: User; exp: number } = jwtDecode(token);

        if (!decodedToken.userdata) {
            localStorage.removeItem('token');
            return null;
        }

        if (Date.now() >= decodedToken.exp * 1000) {
            localStorage.removeItem('token');
            return null;
        }

        return decodedToken.userdata;
    } catch (error) {
        console.error("Error decoding token:", error);
        localStorage.removeItem('token');
        return null;
    }
}
