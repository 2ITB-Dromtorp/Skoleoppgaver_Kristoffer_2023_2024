import { useEffect, useMemo, useState } from "react";
import { Tournaments, User } from "../../utils/types";
import axios from "axios";
import { Grid, Typography, CircularProgress, Select, MenuItem } from "@mui/material";
import TournamentBox from "../TournamentBox/TournamentBox";
interface TournamentPageProps {
    userdata: User | null;
}

export default function TournamentPage({ userdata }: TournamentPageProps) {
    const [tournaments, setTournaments] = useState<Tournaments[]>([]);
    const [sortOption, setSortOption] = useState<'alphabetical' | 'registered' | 'sport' | 'most registered'>('alphabetical');

    const fetchTournaments = async () => {
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

            const response = await axios.get<Tournaments[]>(`/api/get-tournaments`, config);
            setTournaments(response.data);

        } catch (error) {
            console.log(error)
        }
    };

    useEffect(() => {
        fetchTournaments();
    }, [])

    const sortedTournaments = useMemo(() => {
        const sortedList = [...tournaments];
        switch (sortOption) {
            case 'alphabetical':
                sortedList.sort((a, b) => a.Tournament_Name.localeCompare(b.Tournament_Name));
                break;
            case 'registered':
                sortedList.sort((a, b) => a.Registered_Users.length - b.Registered_Users.length);
                break;
            case 'most registered':
                sortedList.sort((a, b) => a.Registered_Users.length + b.Registered_Users.length);
                break;
            case 'sport':
                sortedList.sort((a, b) => a.Sport.localeCompare(b.Sport));
                break;
            default:
                break;
        }
        return sortedList;
    }, [tournaments, sortOption]);

    return (
        <div className="tournamentpage-container">

            {userdata &&
                <div>
                    <div className="mb-3 flex flex-row justify-between">
                        <Typography variant="h4">Innkommende Turneringer</Typography>
                        <Select
                            labelId="sorter"
                            value={sortOption}
                            label="Sorter"
                            onChange={(event: { target: { value: string; }; }) => setSortOption(event.target.value as 'alphabetical' | 'registered' | 'sport' | 'most registered')}
                        >
                            <MenuItem value={'alphabetical'}>Alfabetisk Rekkefølge</MenuItem>
                            <MenuItem value={'most registered'}>Høyest påmeldelser</MenuItem>
                            <MenuItem value={'registered'}>Minst påmeldelser</MenuItem>
                            <MenuItem value={'sport'}>Sport</MenuItem>
                        </Select>
                    </div>

                    <Grid container spacing={3}>
                        {sortedTournaments ?
                            sortedTournaments.map((tournament) => {
                                const isRegistered = tournament.Registered_Users.includes(userdata._id.toString());

                                return <TournamentBox key={tournament._id} tournamentdata={tournament} isregistered={isRegistered} />
                            })

                            :
                            <CircularProgress />
                        }
                    </Grid>
                </div>
            }


        </div>
    );
}
