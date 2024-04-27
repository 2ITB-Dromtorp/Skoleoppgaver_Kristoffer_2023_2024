import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, IconButton, List, ListItem, ListItemText, Typography } from '@mui/material';
import { Delete } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

import "./AddEquipment.css"
import CheckUserRole from '../../utils/CheckUserRole';

export default function AddEquipment() {
  const [formData, setFormData] = useState({
    _id: '',
    Type: '',
    Model: '',
    Specs: [],
    BorrowStatus: {
      currentStatus: 'available',
      studentsborrowing: [],
    },
  });

  const [newSpec, setNewSpec] = useState('');

  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSpecChange = (e) => {
    setNewSpec(e.target.value);
  };

  const handleAddSpec = () => {
    if (newSpec.trim() !== '') {
      setFormData((prevFormData) => ({
        ...prevFormData,
        Specs: [...prevFormData.Specs, newSpec.trim()],
      }));
      setNewSpec('');
    }
  };

  const handleRemoveSpec = (spec) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      Specs: prevFormData.Specs.filter((s) => s !== spec),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/add-equipment', formData);
      if (response.status === 200) {
        console.log('Equipment added successfully');
        setFormData({
          _id: '',
          Type: '',
          Model: '',
          Specs: [],
          BorrowStatus: {
            currentStatus: 'available',
            studentsborrowing: [],
          },
        });
      }
    } catch (error) {
      console.error('Error adding equipment:', error.response?.data?.error || error.message);
    }
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
            label="Serial Number"
            name="_id"
            value={formData._id}
            onChange={handleChange}
          />
        </div>
        <div>
          <TextField
            label="Type"
            name="Type"
            value={formData.Type}
            onChange={handleChange}
          />
        </div>
        <div>
          <TextField
            label="Model"
            name="Model"
            value={formData.Model}
            onChange={handleChange}
          />
        </div>
        <div>
          <TextField
            label="Add Spec"
            value={newSpec}
            onChange={handleSpecChange}
          />
          <Button variant="contained" onClick={handleAddSpec}>
            Add Spec
          </Button>
        </div>
        <List>
          {formData.Specs.map((spec, index) => (
            <ListItem key={index}>
              <ListItemText primary={spec} />
              <IconButton edge="end" onClick={() => handleRemoveSpec(spec)}>
                <Delete />
              </IconButton>
            </ListItem>
          ))}
        </List>
        <Button type="submit" variant="contained" color="primary">
          Add Equipment
        </Button>
      </form>
    </div>
  );
}