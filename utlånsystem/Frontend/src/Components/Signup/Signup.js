import { useState } from "react";
import axios from "axios";
import { TextField, Button, FormControl, InputLabel, Select, MenuItem, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

import "./Signup.css"

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("None");
  const [adress, setAdress] = useState("");
  const [city, setCity] = useState("");
  const [schoolclass, setSchoolClass] = useState("None");
  
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const userData = {
        email,
        password,
        role,
        class_id: schoolclass,
        contact_info: {
          firstname,
          lastname,
          phone,
          adress,
          city,
        },
      };
      
      const response = await axios.post("/api/signup", userData);

      if (response.status === 200) {
        navigate("/");
      }
    } catch (error) {
      console.log(error.response?.data)
    }
  };

  return (
    <div className="signup-container">
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
          value={firstname}
          onChange={(e) => setFirstname(e.target.value)}
        />
        
        <TextField
          label="Last Name"
          variant="outlined"
          fullWidth
          margin="normal"
          required
          value={lastname}
          onChange={(e) => setLastname(e.target.value)}
        />
        
        <TextField
          label="Phone Number"
          variant="outlined"
          fullWidth
          margin="normal"
          required
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        
        <TextField
          label="Address"
          variant="outlined"
          fullWidth
          margin="normal"
          required
          value={adress}
          onChange={(e) => setAdress(e.target.value)}
        />
        
        <TextField
          label="City"
          variant="outlined"
          fullWidth
          margin="normal"
          required
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        
        <FormControl fullWidth margin="normal">
          <InputLabel>Role</InputLabel>
          <Select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
          >
            <MenuItem value="None">Select Role</MenuItem>
            <MenuItem value="Teacher">Teacher</MenuItem>
            <MenuItem value="Student">Student</MenuItem>
          </Select>
        </FormControl>
        
        <FormControl fullWidth margin="normal">
          <InputLabel>School Class</InputLabel>
          <Select
            value={schoolclass}
            onChange={(e) => setSchoolClass(e.target.value)}
            required
          >
            <MenuItem value="None">Select School Class</MenuItem>
            <MenuItem value="2ITB">2ITB</MenuItem>
            <MenuItem value="2ITA">2ITA</MenuItem>
            <MenuItem value="IM">IM</MenuItem>
          </Select>
        </FormControl>
        
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