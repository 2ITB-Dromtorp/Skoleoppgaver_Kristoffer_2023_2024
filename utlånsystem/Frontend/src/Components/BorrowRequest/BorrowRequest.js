import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Grid, CardContent, Typography, Card, Button } from '@mui/material';
import { FetchProtectedData } from '../../utils/FetchProtectedData';
import CheckUserRole from '../../utils/CheckUserRole';
import { useNavigate } from 'react-router-dom';

import './BorrowRequest.css'

export default function BorrowRequest() {
  const [borrowRequests, setBorrowRequests] = useState([]);
  const [equipmentData, setEquipmentData] = useState([])
  const [borrowRequestNumber, setborrowRequestNumber] = useState(0);

  const navigate = useNavigate();

  const fetchBorrowRequests = async () => {
    try {
      const data = await FetchProtectedData("/api/get-borrow-requests");
      setBorrowRequests(data);
      setborrowRequestNumber(data.length > 0 ? (data.length) : 0)
    } catch (error) {
      console.error("Error fetching borrow requests:", error.message);
    }
  };

  const fetchEquipments = async () => {
    try {
      const data = await FetchProtectedData('/api/get-equipments');
      setEquipmentData(data);
    } catch (error) {
      console.error('Error fetching equipment data:', error.message);
    }
  };

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

      if (action === "accept") {
        await axios.put(
          "/api/borrow-accept",
          { equipmentId },
          config
        );
      } else if (action === "deny") {
        await axios.put(
          "/api/borrow-deny",
          { equipmentId },
          config
        );
      }

      fetchBorrowRequests();
    } catch (error) {
      console.error(`Error processing borrow request (${action}):`, error.message);
    }
  };

  useEffect(() => {
    fetchBorrowRequests();
    fetchEquipments();
  }, []);

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
                    <Typography>Serial Number: {request.requestId}</Typography>
                    <Typography>Type: {request.equipment.Type}</Typography>
                    <Typography>Specs: {request.equipment.Specs.join(', ')}</Typography>
                    <Typography>Requested by: {request.students.map((student) => student.firstname).join(', ')}</Typography>
                  </>
                )}
                <div className='button-container'>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleBorrowRequest("deny", request.requestId)}
                  >
                    Deny
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleBorrowRequest("accept", request.requestId)}
                  >
                    Accept
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