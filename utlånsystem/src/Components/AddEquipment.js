import React, { useState } from 'react';
import axios from 'axios';

export default function AddEquipment() {
  const [formData, setFormData] = useState({
    _id: '',
    Type: '',
    Model: '',
    Specs: [],
    BorrowStatus: {
      currentStatus: 'available',
      studentsborrowing: []
    }
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/api/add-equipment', formData);
      if (response.status === 200) {
        console.log('Equipment added successfully');
        setFormData({
          _id: '',
          Type: '',
          Model: '',
          Specs: [],
          BorrowStatus: {
            currentStatus: 'available',
            studentsborrowing: []
          }
        });
      }
      console.log(response)
    } catch (error) {
      console.error('Error adding equipment:', error.response.data.error);
      setError('Error adding equipment. Please try again later.');
    }
  };

  return (
    <div>
      <h2>Add Equipment</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <label>
          Serial Number:
          <input type="text" name="_id" value={formData._id} onChange={handleChange} />
        </label>
        <label>
          Type:
          <input type="text" name="Type" value={formData.Type} onChange={handleChange} />
        </label>
        <label>
          Model:
          <input type="text" name="Model" value={formData.Model} onChange={handleChange} />
        </label>
        <button type="submit">Add Equipment</button>
      </form>
    </div>
  );
}