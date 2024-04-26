import { Grid, CardContent, Typography, Card, Button } from '@mui/material';
import { FetchProtectedData } from '../../utils/FetchProtectedData';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'

import './UserHomePage.css'

export default function UserHomePage() {
    const [userEquipmentData, setUserEquipmentData] = useState(null);

    const navigate = useNavigate()

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

        const fetchEquipments = async () => {
        try {
            const data = await FetchProtectedData('http://localhost:8080/api/get-user-equipments');
            setUserEquipmentData(data);
        } catch (error) {
            console.error('Error fetching equipment data:', error.message);
        }
    };


    useEffect(() => {
        fetchEquipments();
    }, [navigate]);


    return (
        <>
        {userEquipmentData && (
            <Grid className='grid-container' container spacing={2}>
            <div className='borrowed-equipment'>
              <Typography variant="h5">Lånt Utstyr</Typography>
              {userEquipmentData.borrowed.map((equipment) => (
                <Grid item sm={14} key={equipment._id}>
                  <Card className="card">
                    <CardContent className="card-content">
                      <Typography variant="h6">{equipment.Model}</Typography>
                      <Typography>Type: {equipment.Type}</Typography>
                      <Typography>Specs: {equipment.Specs.join(', ')}</Typography>
                      <Typography>Serial Number: {equipment._id}</Typography>
                      <Button className="button" onClick={() => handleRemoveBorrow(equipment._id)}>Ferdig</Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </div>
      
            <div className='pending-equipment'>
              <Typography variant="h5">Venter på forespørsel</Typography>
              {userEquipmentData.pending.map((equipment) => (
                <Grid item sm={14} key={equipment._id}>
                  <Card className="card">
                    <CardContent className="card-content">
                      <Typography variant="h6">{equipment.Model}</Typography>
                      <Typography>Type: {equipment.Type}</Typography>
                      <Typography>Specs: {equipment.Specs.join(', ')}</Typography>
                      <Typography>Serial Number: {equipment._id}</Typography>
                      <Typography>Requested by: {equipment.BorrowStatus.studentsborrowing.map((student) => student.firstname).join(', ')}</Typography>
                      <Button className="button" onClick={() => handleRemoveBorrow(equipment._id)}>Avbryt</Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </div>
          </Grid>
        )}
      </>
    );
  }