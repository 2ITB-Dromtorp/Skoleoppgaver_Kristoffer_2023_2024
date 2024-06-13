import { Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";

import "./HomePage.css"
import { useEffect, useState } from "react";
import axios from "axios";
import { Sport, User } from "../../utils/types";
import { useAlert } from "../../utils/AlertContext";

interface HomepageProps {
    userdata: User | null;
}
export default function HomePage({ userdata }: HomepageProps) {

    const [sports, setSports] = useState<Sport[]>([]);
    const [updateduser, setupdatedUser] = useState<User>();
    const { showAlert } = useAlert();

    const fetchSports = async () => {
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

            const response = await axios.get('/api/get-sports', config);
            setSports(response.data);
        } catch (error) {
            console.error('Error fetching sports:', error);
        }
    };
    const fetchUser = async () => {
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

            const response = await axios.get('/api/user-info', config);
            setupdatedUser(response.data);
            
        } catch (error) {
            console.error('Error fetching sports:', error);
        }
    }

    useEffect(() => {
        fetchSports();
        fetchUser();
    }, []);

    async function registerSport(sport: string) {
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

            const response = await axios.post('/api/register-sport', { sportname: sport }, config);
            fetchSports();
            fetchUser();
            showAlert(response.data.message, 'success')
        } catch (error) {
            console.error(error)
        }
    }

    async function unregisterSport(sport: string) {
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

            const response = await axios.post('/api/unregister-sport', { sportname: sport }, config);
            fetchSports();
            fetchUser();
            showAlert(response.data.message, 'success')
        } catch (error) {
            console.error('Error registering sport:', error);
        }
    }

    const isRegisteredToSport = (sportName: string) => updateduser?.Sport.includes(sportName);

    return (
        <div className="home-container">
            <Typography variant="h4">Velkommen {userdata?.FirstName} {userdata?.LastName}</Typography>
            <Typography variant="h5">Meld deg på en idrett</Typography>

            <TableContainer component={Paper}>
                <Table className="w-32">
                    <TableHead>
                        <TableRow>
                            <TableCell>Idrett</TableCell>
                            <TableCell>Innkommende turneringer</TableCell>
                            <TableCell align="right">Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {sports && sports.map((sport: Sport) => (
                            <TableRow key={sport.Name}>
                                <TableCell>{sport.Name}</TableCell>
                                <TableCell>{sport.Incoming_Tournaments}</TableCell>
                                <TableCell align="right">
                                    {isRegisteredToSport(sport.Name) ? (
                                        <Button variant="contained" color="secondary" onClick={() => unregisterSport(sport.Name)}> Avmeld </Button>
                                    ) : (
                                        <Button variant="contained" onClick={() => registerSport(sport.Name)}> Meld på </Button>
                                    )}                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

        </div>
    );
}
