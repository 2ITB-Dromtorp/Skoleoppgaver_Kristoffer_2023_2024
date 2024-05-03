import { Grid, Typography, Button, Accordion, AccordionDetails, AccordionSummary, AccordionActions } from '@mui/material';
import { FetchProtectedData } from '../../utils/FetchProtectedData';
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios'
import { useAlert } from '../../utils/useAlert';

import { ArrowDropDown } from '@mui/icons-material'

import './UserHomePage.css'

export default function UserHomePage() {
  const [userEquipmentData, setUserEquipmentData] = useState(null);
  const { setAlert } = useAlert();

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
      await axios.put('/api/remove-borrowed-equipment', { equipmentId }, config);
      setAlert({ message: "Fjernet lånt forespørsel", type: 'success' })
      fetchEquipments()
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'En uventet feil oppstod.';
      setAlert({ message: errorMessage, type: 'error' })
    }
  }

  const fetchEquipments = useCallback(async () => {
    try {
      const data = await FetchProtectedData('/api/get-user-equipments');
      setUserEquipmentData(data);
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'En uventet feil oppstod.';
      setAlert({ message: errorMessage, type: 'error' })
    }
  }, [setAlert]);

  useEffect(() => {
    fetchEquipments();
  }, [fetchEquipments]);

  return (
    <>
      {userEquipmentData && (
        <Grid className='grid-container'>

          <div className='borrowed-equipment'>
            <Typography variant="h5">Lånt Utstyr</Typography>
            {userEquipmentData.borrowed.map((equipment) => (
              <Accordion key={equipment._id}>
                <AccordionSummary
                  expandIcon={<ArrowDropDown />}
                >
                  <Typography>{equipment.Model}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>Type: {equipment.Type}</Typography>
                  <Typography>Specs: {equipment.Specs.join(', ')}</Typography>
                  <Typography>Serienummer: {equipment._id}</Typography>
                  <Typography>Forespurt av: {equipment.BorrowStatus.studentsborrowing.map((student) => student.firstname).join(', ')}</Typography>
                </AccordionDetails>

                <AccordionActions>
                  <Button className="button" onClick={() => handleRemoveBorrow(equipment._id)}>Ferdig</Button>
                </AccordionActions>
              </Accordion>
            ))}
          </div>

          <div className='pending-equipment'>
            <Typography variant="h5">Venter på forespørsel</Typography>
            {userEquipmentData.pending.map((equipment) => (
              <Accordion key={equipment._id}>
                <AccordionSummary
                  expandIcon={<ArrowDropDown />}
                >
                  <Typography>{equipment.Model}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>Type: {equipment.Type}</Typography>
                  <Typography>Specs: {equipment.Specs.join(', ')}</Typography>
                  <Typography>Serienummer: {equipment._id}</Typography>
                  <Typography>Forespurt av: {equipment.BorrowStatus.studentsborrowing.map((student) => student.firstname).join(', ')}</Typography>
                </AccordionDetails>

                <AccordionActions>
                  <Button className="button" onClick={() => handleRemoveBorrow(equipment._id)}>Avbryt</Button>
                </AccordionActions>
              </Accordion>
            ))}
          </div>
        </Grid>
      )}
    </>
  );
}