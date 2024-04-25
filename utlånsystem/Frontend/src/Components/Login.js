import { useState } from "react"
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const loginData = {
                email: email,
                password: password
            };
            const response = await axios.post("http://localhost:8080/api/login", loginData);
            const token = response.data.token;
            localStorage.setItem("token", "Bearer " + token);
            console.log("logged in")
            navigate("/");
        } catch (error) {
            console.error("Login failed:", error.response.data);
        }
    }

    return (
        <div>
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
                <label>Email:</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />

                <label>Password:</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />

                <button type="submit">Login</button>
            </form>
        </div>
    );
}