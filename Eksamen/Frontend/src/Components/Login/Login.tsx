import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Typography } from "@mui/material";
import { GetUserData } from "../../utils/getUserData";
import { User } from "../../utils/types";

interface LoginProps {
    setUserData: (user: User | null) => void;
}

export default function Login({ setUserData }: LoginProps) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const loginData = { email, password };
            const response = await axios.post("/api/login", loginData);

            const token = response.data.token;
            localStorage.setItem("token", 'Bearer ' + token);

            const userdata = GetUserData();
            setUserData(userdata);

            navigate("/");
        } catch (error) {
            console.error("Login failed:", error);
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
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <Button type="submit" variant="contained" color="primary" fullWidth>
                    Login
                </Button>
            </form>
        </div>
    );
}
