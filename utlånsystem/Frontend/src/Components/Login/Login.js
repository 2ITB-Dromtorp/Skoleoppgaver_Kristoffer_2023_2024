import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { TextField, Button, Typography } from "@mui/material";
import "./Login.css";
import { useAlert } from "../../utils/useAlert";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { setAlert } = useAlert();

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const loginData = {
                email,
                password,
            };

            const response = await axios.post("/api/login", loginData);

            const token = response.data.token;

            localStorage.setItem("token", 'Bearer ' + token);
            setAlert({ message: 'logget på vellykket', type: 'info' });

            navigate("/");
        } catch (error) {
            const errorMessage = error.response?.data?.error || 'En uventet feil oppstod.';
            setAlert({ message: errorMessage, type: 'error' });
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
                    label="Password"
                    type="password"
                    fullWidth
                    variant="outlined"
                    required
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