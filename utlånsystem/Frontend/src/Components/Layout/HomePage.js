import { useEffect, useState } from "react";
import { GetUserData } from "../../utils/GetUserData";
import { useNavigate } from 'react-router-dom';
import { FetchProtectedData } from "../../utils/FetchProtectedData";
import { Grid, CardContent, Typography, Card, Button } from '@mui/material';
import axios from 'axios';

export default function HomePage() {
    const [userdata, setUserData] = useState(null);
    const [userEquipmentData, setUserEquipmentData] = useState(null);

    const navigate = useNavigate()

    const fetchEquipments = async () => {
        try {
            const data = await FetchProtectedData('http://localhost:8080/api/get-user-equipments');
            setUserEquipmentData(data);
        } catch (error) {
            console.error('Error fetching equipment data:', error.message);
        }
    };

    const handleRemoveBorrow = async (equipmentId) => {
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
            await axios.post('http://localhost:8080/api/remove-borrowed-equipment', { equipmentId }, config);
            fetchEquipments()
        } catch (error) {
            console.error('Error removing data', error.message);
        }
    }


    useEffect(() => {
        const fetchUserData = async () => {
            const data = await GetUserData(navigate);
            setUserData(data);
        };

        fetchUserData();
        fetchEquipments();

    }, [navigate]);

    return (
        <div>
            {userdata &&
                <div>
                    <p className="">Velkommen {userdata.contact_info.firstname}</p>
                </div>
            }

            {userEquipmentData && <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Typography variant="h5">Lånt Utstyr</Typography>
                </Grid>
                {userEquipmentData.borrowed.map((equipment) => (
                    <Grid item xs={12} sm={6} md={4} key={equipment._id}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6">{equipment.Model}</Typography>
                                <Typography>Type: {equipment.Type}</Typography>
                                <Typography>Specs: {equipment.Specs.join(', ')}</Typography>
                                <Typography>Serial Number: {equipment._id}</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}

                <Grid item xs={12}>
                    <Typography variant="h5">Venter på forespørsel</Typography>
                </Grid>
                {userEquipmentData.pending.map((equipment) => (
                    <Grid item xs={12} sm={6} md={4} key={equipment._id}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6">{equipment.Model}</Typography>
                                <Typography>Type: {equipment.Type}</Typography>
                                <Typography>Specs: {equipment.Specs.join(', ')}</Typography>
                                <Typography>Serial Number: {equipment._id}</Typography>
                                <Typography>Requested by: {equipment.BorrowStatus.studentsborrowing.map((student) => student.firstname)}</Typography>
                                <Button onClick={() => handleRemoveBorrow(equipment._id)}>Avbryt</Button>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>}

        </div>
    );
}
