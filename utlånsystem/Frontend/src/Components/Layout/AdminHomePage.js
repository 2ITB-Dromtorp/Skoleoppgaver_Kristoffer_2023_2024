import { useState, useCallback, useEffect } from "react";
import axios from 'axios'

import {Grid, Typography, Card, CardContent, Button} from '@mui/material'

import { useAlert } from "../../utils/useAlert";
import { FetchProtectedData } from "../../utils/FetchProtectedData";

export default function AdminHomePage() {
    const [TeacherRequests, setTeacherRequests] = useState([])
    const {setAlert} = useAlert()

    const fetchTeacherRequests = useCallback(async () => {
        try {
          const data = await FetchProtectedData('/api/get-teacher-requests');
          setTeacherRequests(data);
        } catch (error) {
          const errorMessage = error.response?.data?.error || 'En uventet feil oppstod.';
          setAlert({ message: errorMessage, type: 'error'})
        }
      }, [setAlert]);

    useEffect(() => {
        fetchTeacherRequests();
    }, [fetchTeacherRequests]);

    const handleTeacherVerify = async (action, data) => {
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
    
          if (action === "verify") {
            response = await axios.put(
              "/api/verify-teacher",
              { data },
              config
            );
          } else if (action === "unverify") {
            response = await axios.put(
              "/api/unverify-teacher",
              { data },
              config
            );
          }
          setAlert({ message: response.data.message, type: 'success'})
          fetchTeacherRequests();
        } catch (error) {
          const errorMessage = error.response?.data?.error || 'En uventet feil oppstod.';
          setAlert({ message: errorMessage, type: 'error'})
        }
      };

    return (
        <>
            {TeacherRequests.length > 0 && 
                <Grid container spacing={2}>
                {TeacherRequests.map((user) => (
                  <Grid item xs={12} sm={8} md={4} key={user._id}>
                    <Card>
                      <CardContent>
                            <Typography variant="h6">Navn: {user.contact_info.firstname}</Typography>
                            <Typography>Klasse: {user.class_id}</Typography>
                            <Typography>Email: {user.email}</Typography>
                            <Typography>Phone: {user.contact_info.phone}</Typography>
                        <div className='button-container'>
                          <Button
                            variant="contained"
                            color="secondary"
                            onClick={() => handleTeacherVerify("unverify", user)}
                          >
                            Benekte
                          </Button>
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={() => handleTeacherVerify("verify", user)}
                          >
                            Verifiser
                          </Button>
                        </div>
        
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            }
        </>
    )
}