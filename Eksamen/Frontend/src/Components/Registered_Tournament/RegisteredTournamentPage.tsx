import axios from "axios";
import { Tournaments } from "../../utils/types";
import { useEffect, useState } from "react";
import { Accordion, AccordionActions, AccordionDetails, AccordionSummary, Button, CircularProgress, Typography } from "@mui/material";
import { ArrowDropDown } from "@mui/icons-material";

import './RegisteredTournamentPage.css'
export default function RegisteredTournamentPage() {

    const [registeredTournaments, setRegisteredTournaments] = useState<Tournaments[]>([])

    const fetchRegisteredTournament = async () => {
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

            const response = await axios.get<Tournaments[]>(`/api/get-registered-tournaments`, config);
            setRegisteredTournaments(response.data);

        } catch (error) {
            console.log(error)
        }
    };

    useEffect(() => {
        fetchRegisteredTournament();
    }, [])

    async function handleRemoveBorrow(_id: string) {
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
            await axios.post('/api/unregister-tournament', { tournamentID: _id }, config);
            fetchRegisteredTournament();

        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="registertournament-container">

            <div className="mb-3">
                <Typography variant="h4">Påmeldte turneringer</Typography>
            </div>

            <div>
                {registeredTournaments ? (
                    registeredTournaments.map((tournament) => {
                        return <Accordion key={tournament._id}>
                            <AccordionSummary
                                expandIcon={<ArrowDropDown />}
                            >
                                <Typography variant="h5">{tournament.Tournament_Name}</Typography>

                            </AccordionSummary>
                            <AccordionDetails>
                                <Typography>Oppmøte tid: {tournament.Attendance_Time}</Typography>
                                <Typography>Dato: {tournament.Start_Date} - {tournament.End_Date}</Typography>
                                <Typography>Sted: {tournament.Attendance_Place}</Typography>
                            </AccordionDetails>

                            <AccordionActions>
                                <Button variant="contained" className="button" onClick={() => handleRemoveBorrow(tournament._id)}>Avmeld</Button>
                            </AccordionActions>
                        </Accordion>
                    })
                )

                    :
                    <CircularProgress />
                }

            </div>

        </div>
    );
}
