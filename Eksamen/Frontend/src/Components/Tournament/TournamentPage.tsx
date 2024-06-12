import { useEffect, useState } from "react";
import { Tournaments, User } from "../../utils/types";
import axios from "axios";
import { Grid, Typography, CircularProgress } from "@mui/material";
import TournamentBox from "../TournamentBox/TournamentBox";
interface TournamentPageProps {
    userdata: User | null;
  }
  
export default function TournamentPage({ userdata }: TournamentPageProps) {
    const [tournaments, setTournaments] = useState<Tournaments[]>([]);

    const fetchTournaments = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Token not found');
                return;
            }
            const config = {
                headers: {
                    Authorization: token
                }
            };

            const response = await axios.get<Tournaments[]>(`/api/get-tournaments/${userdata?.Sport}`, config);
            setTournaments(response.data);

        } catch (error) {
            console.log(error)
        }
    };

    useEffect(() => {
        fetchTournaments();
    }, [])

    console.log(tournaments)

    return (
        <div className="tournamentpage-container">

            <div>
                <Typography variant="h4">Innkommende Turneringer</Typography>
            </div>

            <Grid container spacing={3}>
                {tournaments ? 

                    tournaments.map((tournament) => {
                        return <TournamentBox key={tournament._id} _id={tournament._id} Tournament_Name={tournament.Tournament_Name} Sport={tournament.Sport} Description={tournament.Description} Status={tournament.Status} Start_Date={tournament.Start_Date} End_Date={tournament.End_Date} Attendance_Time={tournament.Attendance_Time} Format={tournament.Format} Registered_Users={tournament.Registered_Users} Attendance_Place={tournament.Attendance_Place} />
                    })
                
                :               
                <CircularProgress />
                }
            </Grid>
        </div>
    );
}
