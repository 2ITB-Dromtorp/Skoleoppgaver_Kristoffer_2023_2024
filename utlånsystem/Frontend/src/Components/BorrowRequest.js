import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Grid, CardContent, Typography, Card, Button } from '@mui/material';

export default function BorrowRequest() {
  const [borrowRequests, setBorrowRequests] = useState([]);

  const fetchBorrowRequests = async () => {
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
      const response = await axios.get("http://localhost:8080/api/get-borrow-requests", config);
      setBorrowRequests(response.data);
    } catch (error) {
      console.error("Error fetching borrow requests:", error.message);
    }
  };

  const handleBorrowRequest = async (action, equipmentId, studentId) => {
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
        await axios.post(
          "http://localhost:8080/api/borrow-accept",
          { equipmentId, studentId },
          config
        );
      } else if (action === "deny") {
        await axios.post(
          "http://localhost:8080/api/borrow-deny",
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
  }, []);

  return (
    <div>
      {borrowRequests && <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h5">Borrow Request</Typography>
        </Grid>
        {borrowRequests.map((request) => (
          <Grid item xs={12} sm={6} md={4} key={request._id}>
            <Card>
              <CardContent>
                <Typography variant="h6">{request._id}</Typography>
                <Button>Decline</Button>
                <Button>Accept</Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>}
    </div>
  );
}