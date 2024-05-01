import axios from 'axios';
import React, { useEffect, useState, useCallback } from 'react';
import { Grid, CardContent, Typography, Card, Button } from '@mui/material';
import { FetchProtectedData } from '../../utils/FetchProtectedData';
import CheckUserRole from '../../utils/CheckUserRole';
import { useNavigate } from 'react-router-dom';
import { useAlert } from '../../utils/useAlert';

import './BorrowRequest.css'

export default function BorrowRequest() {
  const [borrowRequests, setBorrowRequests] = useState([]);
  const [equipmentData, setEquipmentData] = useState([])
  const [borrowRequestNumber, setborrowRequestNumber] = useState(0);
  const { setAlert } = useAlert()

  const navigate = useNavigate();

  const fetchBorrowRequests = useCallback(async () => {
    try {
      const data = await FetchProtectedData("/api/get-borrow-requests");
      setBorrowRequests(data);
      setborrowRequestNumber(data.length > 0 ? (data.length) : 0)
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'En uventet feil oppstod.';
      setAlert({ message: errorMessage, type: 'error'})
    }
  }, [setAlert]);

  const fetchEquipments = useCallback(async () => {
    try {
      const data = await FetchProtectedData('/api/get-equipments');
      setEquipmentData(data);
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'En uventet feil oppstod.';
      setAlert({ message: errorMessage, type: 'error'})
    }
  }, [setAlert]);

  const handleBorrowRequest = async (action, equipmentId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token not found");
      }
      const config = {
        headers: {
          Authorization: token,
        },
      };

      let response 

      if (action === "accept") {
        response = await axios.put(
          "/api/borrow-accept",
          { equipmentId },
          config
        );
      } else if (action === "deny") {
        response = await axios.put(
          "/api/borrow-deny",
          { equipmentId },
          config
        );
      }
      setAlert({ message: response.data.message, type: 'success'})
      fetchBorrowRequests();
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'En uventet feil oppstod.';
      setAlert({ message: errorMessage, type: 'error'})
    }
  };

  useEffect(() => {
    fetchBorrowRequests();
    fetchEquipments();
  }, [fetchEquipments, fetchBorrowRequests]);

  CheckUserRole("Teacher", navigate)

  const detailedBorrowRequests = borrowRequests.map((request) => {
    const equipment = equipmentData.find((eq) => eq._id === request._id);
    return {
      requestId: request._id,
      equipment,
      students: request.studentsborrowing,
    };
  });

  return (
    <div className='borrow-container'>
      {borrowRequestNumber > 0 ? (
        <Typography variant="h5">
          {borrowRequestNumber} vil låne utstyr
        </Typography>
      ) : (
        <Typography variant="h5">Ingen forespørseler</Typography>
      )}

      <Grid container spacing={2}>
        {detailedBorrowRequests.map((request) => (
          <Grid item xs={12} sm={8} md={4} key={request.requestId}>
            <Card>
              <CardContent>
                {request.equipment && (
                  <>
                    <Typography variant="h6">{request.equipment.Model}</Typography>
                    <Typography>Serienummer: {request.requestId}</Typography>
                    <Typography>Type: {request.equipment.Type}</Typography>
                    <Typography>Specs: {request.equipment.Specs.join(', ')}</Typography>
                    <Typography>Forespurt av: {request.students.map((student) => student.firstname).join(', ')}</Typography>
                  </>
                )}
                <div className='button-container'>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleBorrowRequest("deny", request.requestId)}
                  >
                    Benekte
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleBorrowRequest("accept", request.requestId)}
                  >
                    Aksepter
                  </Button>
                </div>

              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
}