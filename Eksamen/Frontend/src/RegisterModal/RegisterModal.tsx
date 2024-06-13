// TournamentInfoModal.tsx
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import { Tournaments } from '../utils/types';
import { Box, Typography } from '@mui/material';
import axios from 'axios';

interface RegisterModalProps {
    open: boolean;
    handleClose: () => void;
    tournamentData: Tournaments;
    isregistered: boolean;
}

export default function RegisterModal({ open, handleClose, tournamentData, isregistered }: RegisterModalProps) {

    const handleRegister = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Token not found');
            }
            const config = {
                headers: {
                    Authorization: token
                }
            };

            await axios.post('/api/register-tournament', { tournamentID: tournamentData._id }, config)
        } catch (error) {
            console.log(error)
        }

        handleClose();
    }

    return (
        <Modal
            open={open}
            onClose={handleClose}
        >
            <Box sx={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', bgcolor: 'background.paper',
                p: 4, borderRadius: 2, boxShadow: 24, maxWidth: 400, margin: 'auto', mt: '10%'
            }}>

                <div>
                    <div>
                        <Typography variant='h5'>{tournamentData.Tournament_Name}</Typography>
                        <Typography variant='h6'>{tournamentData.Format}</Typography>
                        {tournamentData.Description}<br />
                        Dato: {tournamentData.Start_Date} - {tournamentData.End_Date}<br />
                        Sted: {tournamentData.Attendance_Place}<br />
                        Oppmøte: {tournamentData.Attendance_Time}
                    </div>

                    <Button variant="contained" disabled={isregistered} color="primary" onClick={!isregistered ? handleRegister : undefined}>Påmeld</Button>
                </div>

            </Box>

        </Modal>
    );
}
