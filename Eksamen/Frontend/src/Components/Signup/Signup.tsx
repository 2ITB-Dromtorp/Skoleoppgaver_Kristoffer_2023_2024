import { useState } from "react";
import axios from "axios";
import { TextField, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

import { useAlert } from "../../utils/AlertContext";
import { GetUserData } from "../../utils/getUserData";
import { User } from "../../utils/types";

interface SignupProps {
    setUserData: (user: User | null) => void;
}


export default function Signup({ setUserData }: SignupProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const { showAlert } = useAlert();

  const navigate = useNavigate();

  const handleSignup = async () => {
    try {

      const response = await axios.post("/api/signup", {Email: email, Password: password, FirstName: firstname, LastName: lastname });

      const token = response.data.token;
      localStorage.setItem("token", 'Bearer ' + token);

      showAlert(response.data.message, 'success');
      const userdata = GetUserData();
      setUserData(userdata);
      
      navigate("/");
    } catch (error) {
        console.error(error)
    }
  };

  return (
    <div className="signup-container flex flex-col justify-center items-center text-center">
      <Typography variant="h4" align="center">
        Sign Up
      </Typography>

      <form className="signup-form" onSubmit={handleSignup}>
        <TextField
          label="Email"
          variant="outlined"
          fullWidth
          margin="normal"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
        />

        <TextField
          label="Password"
          type="password"
          variant="outlined"
          fullWidth
          margin="normal"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <TextField
          label="First Name"
          variant="outlined"
          fullWidth
          margin="normal"
          required
          inputProps={{
            minLength: 3,
            maxLength: 20,
            pattern: "^[a-zA-Z]+$",
          }}
          value={firstname}
          onChange={(e) => setFirstname(e.target.value)}
        />

        <TextField
          label="Last Name"
          variant="outlined"
          fullWidth
          margin="normal"
          required
          inputProps={{
            minLength: 3,
            maxLength: 20,
            pattern: "^[a-zA-Z]+$",
          }}
          value={lastname}
          onChange={(e) => setLastname(e.target.value)}
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
        >
          Sign Up
        </Button>
      </form>
    </div>
  );
}