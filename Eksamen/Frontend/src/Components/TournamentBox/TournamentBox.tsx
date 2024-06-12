import { Tournaments } from '../../utils/types';
import { Card, CardMedia, CardContent, Typography, Grid } from '@mui/material';
//import { useNavigate } from 'react-router-dom';

import './TournamentBox.css';
import { getImage } from '../../utils/getImage';
import RegisterModal from '../../RegisterModal/RegisterModal';
import { useState } from 'react';

export default function TournamentBox({ _id, Tournament_Name, Sport, Description, Status, Start_Date, End_Date, Attendance_Time, Format, Registered_Users, Attendance_Place}: Tournaments) {

    //const navigate = useNavigate();

    const [open, setOpen] = useState(false);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <>
            <Grid item onClick={handleOpen}>
                <Card className="tournament-card">
                    <CardMedia
                        component="img"
                        style={{ objectFit: 'cover'}}
                        className='tournament-image'
                        alt={Tournament_Name}
                        image={getImage(Sport)}
                    />

                    <CardContent className="content">
                        <Typography variant="h5" >{Tournament_Name}</Typography>
                        <Typography variant="h6">{Format}</Typography>
                        <Typography >{Start_Date}-{End_Date}</Typography>
                        <Typography>{Attendance_Place}</Typography>
                        <Typography>Status: {Status}</Typography>
                    </CardContent>

                </Card>
            </Grid>
            <RegisterModal
                open={open}
                handleClose={handleClose}
                tournamentData={{
                    _id,
                    Tournament_Name,
                    Sport,
                    Description,
                    Status,
                    Start_Date,
                    End_Date,
                    Attendance_Time,
                    Format,
                    Registered_Users,
                    Attendance_Place
                }}
            />
        </>

    );
}
