import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { TextField, Button, Typography } from "@mui/material";
//import "./Login.css";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const loginData = {
                email,
                password,
            };

            const response = await axios.post("/api/login", loginData);

            const token = response.data.token;

            localStorage.setItem("token", 'Bearer ' + token);

            navigate("/");
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="login-container">
            <Typography variant="h4" align="center">
                Login
            </Typography>

            <form className="login-form" onSubmit={handleLogin}>
                <TextField
                    label="Email"
                    type="email"
                    fullWidth
                    variant="outlined"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <TextField
                    label="Passord"
                    type="password"
                    fullWidth
                    variant="outlined"
                    required
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                >
                    Login
                </Button>
            </form>

            <div className="signup-link">
                <Typography variant="body1" align="center">
                    Har du ikke en konto? <Link to="/signup">Lag konto</Link>
                </Typography>
            </div>
        </div>
    );
}