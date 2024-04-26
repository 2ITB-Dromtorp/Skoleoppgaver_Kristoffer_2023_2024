import { useEffect, useState } from "react";
import { GetUserData } from "../../utils/GetUserData";
import UserHomePage from "./UserHomePage";
import './HomePage.css'
import {Typography, CircularProgress} from '@mui/material'
import TeacherHomePage from "./TeacherHomePage";

export default function HomePage() {
    const [userdata, setUserData] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            const data = await GetUserData();
            setUserData(data);
        };

        fetchUserData();

    }, []);


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
