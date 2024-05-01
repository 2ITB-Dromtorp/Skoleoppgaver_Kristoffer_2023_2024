import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, IconButton, List, ListItem, ListItemText, Typography } from '@mui/material';
import { Delete } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAlert } from '../../utils/useAlert';


import "./AddEquipment.css"
import CheckUserRole from '../../utils/CheckUserRole';

export default function AddEquipment() {
  const [Serial, setSerial] = useState("")
  const [Type, setType] = useState("")
  const [Model, setModel] = useState("")
  const [Specs, setSpecs] = useState([])

  const [newSpec, setNewSpec] = useState('');

  const {setAlert} = useAlert()

  const navigate = useNavigate()

  const handleSpecChange = (e) => {
    setNewSpec(e.target.value);
  };

  const handleAddSpec = () => {
    if (newSpec.trim() !== '') {
      setSpecs([...Specs, newSpec])
      setNewSpec('');
    }
  };

  const handleRemoveSpec = (spec) => {
    setSpecs(Specs.filter((s) => s !== spec))
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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

      const formdata = {
        _id: Serial,
        Type: Type,
        Model: Model,
        Specs: Specs,
        BorrowStatus: {
          currentStatus: "available",
          studentsborrowing: []
        }
      }

      const response = await axios.put('/api/add-equipment', formdata, config);

      setAlert({ message: response.data.message || '', type: 'success'})

    } catch (error) {
      const errorMessage = error.response?.data?.error || 'En uventet feil oppstod.';
      setAlert({ message: errorMessage, type: 'error'})    }
  };

  CheckUserRole("Teacher", navigate)

  return (
    <div className='addequip-container'>
      <Typography variant="h5">
        Legg til utstyr
      </Typography>
      <form className='equipform' onSubmit={handleSubmit}>
        <div>
          <TextField
            label="Serienummer"
            name="_id"
            value={Serial}
            onChange={(e) => setSerial(e.target.value)}
          />
        </div>
        <div>
          <TextField
            label="Type"
            name="Type"
            value={Type}
            onChange={(e) => setType(e.target.value)}
          />
        </div>
        <div>
          <TextField
            label="Model"
            name="Model"
            value={Model}
            onChange={(e) => setModel(e.target.value)}
          />
        </div>
        <div>
          <TextField
            label="Legg til spec"
            value={newSpec}
            onChange={handleSpecChange}
          />
          <Button variant="contained" onClick={handleAddSpec}>
            Legg til spec
          </Button>
        </div>
        <List>
          {Specs.map((spec, index) => (
            <ListItem key={index}>
              <ListItemText primary={spec} />
              <IconButton edge="end" onClick={() => handleRemoveSpec(spec)}>
                <Delete />
              </IconButton>
            </ListItem>
          ))}
        </List>
        <Button type="submit" variant="contained" color="primary">
        Legg til utstyr
        </Button>
      </form>
    </div>
  );
}