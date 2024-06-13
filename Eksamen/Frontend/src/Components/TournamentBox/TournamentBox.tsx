import { Tournaments } from '../../utils/types';
import { Card, CardMedia, CardContent, Typography, Grid } from '@mui/material';
//import { useNavigate } from 'react-router-dom';

import './TournamentBox.css';
import { getImage } from '../../utils/getImage';
import RegisterModal from '../../RegisterModal/RegisterModal';
import { useState } from 'react';

interface TournamentBoxProps {
    tournamentdata: Tournaments;
    isregistered: boolean;
}

export default function TournamentBox({ tournamentdata, isregistered }: TournamentBoxProps) {

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
                <Card className={`tournament-card ${isregistered ? 'border-green-500 border-2' : ''}`}>
                    <CardMedia
                        component="img"
                        style={{ objectFit: 'cover' }}
                        className='tournament-image'
                        alt={tournamentdata.Tournament_Name}
                        image={getImage(tournamentdata.Sport)}
                    />

                    <CardContent className="content">
                        <Typography variant="h5" >{tournamentdata.Tournament_Name}</Typography>
                        <Typography variant="h6">{tournamentdata.Format}</Typography>
                        <Typography >{tournamentdata.Start_Date} - {tournamentdata.End_Date}</Typography>
                        <Typography>{tournamentdata.Attendance_Place}</Typography>
                        <Typography>Status: {tournamentdata.Status}</Typography>
                    </CardContent>

                </Card>
            </Grid>
            <RegisterModal
                open={open}
                handleClose={handleClose}
                tournamentData={tournamentdata}
                isregistered={isregistered}
            />
        </>

    );
}
