import { useEffect, useState } from "react";
import { GetUserData } from "../../utils/GetUserData";
import UserHomePage from "./UserHomePage";
import './HomePage.css'
import { Typography, CircularProgress } from '@mui/material'
import { useNavigate } from "react-router-dom";
import TeacherHomePage from "./TeacherHomePage";

export default function HomePage() {
  const [userdata, setUserData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = await GetUserData();
        setUserData(data);

        if (!data || !["Student", "Teacher"].includes(data.role)) {
          navigate("/login");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        navigate("/login");
      }
    };

    fetchUserData();

  }, [navigate]);

  return (
    <div className="home-container">
      {userdata ? (
        <>
          <Typography variant="h4">Velkommen, {userdata.contact_info.firstname}!</Typography>
          <Typography variant="body1">Her har du oversikt over lånt utstyr</Typography>
          {userdata.role === "Student" && <UserHomePage />}
          {userdata.role === "Teacher" && <TeacherHomePage />}
        </>
      ) : (
        <CircularProgress />
      )}
    </div>
  );
}
