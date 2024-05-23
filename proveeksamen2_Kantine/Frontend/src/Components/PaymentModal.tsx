import React, { useState } from 'react';
import { Modal, Box, Typography, Button, Checkbox, TextField, FormControlLabel } from '@mui/material';
import { TimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { ShoppingCartItem } from '../utils/types';
import { useNavigate} from 'react-router-dom';
import axios from 'axios';

interface PaymentModalProps {
  open: boolean;
  handleClose: () => void;
  total: number;
  cartItems?: ShoppingCartItem[];
}

export default function PaymentModal({ open, handleClose, total, cartItems }: PaymentModalProps) {
  const [includeLocation, setIncludeLocation] = useState(false);
  const [extraPayment, setExtraPayment] = useState<number>(0);
  const [classroomID, setClassroomID] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<any>(); 

  const navigate = useNavigate();

  const handleLocationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIncludeLocation(event.target.checked);
    setExtraPayment(event.target.checked ? 20 : 0);
  };

  const handleClassroomIDChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value.length <= 4) {
      setClassroomID(event.target.value);
    }
  };

  const handlePayment = async () => {
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
        const orderMethod = includeLocation === true ? "Får maten på " + classroomID : "Hentes ved Kantinen"

        await axios.post('/api/add-order', { Cartproducts: cartItems, DeliveryDate: selectedTime, OrderMethod: orderMethod}, config)
    } catch (error) {
        console.log(error)
    }
    
    handleClose();
    navigate('/');
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>

        <Modal open={open} onClose={handleClose}>
                <Box sx={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', bgcolor: 'background.paper',
                p: 4, borderRadius: 2, boxShadow: 24, maxWidth: 400, margin: 'auto', mt: '10%'
                }}>
                <Typography variant="h5" gutterBottom>Betaling</Typography>
                <Typography variant="h6">Total: {total + extraPayment} Kr</Typography>
                
                <FormControlLabel
                    control={<Checkbox checked={includeLocation} onChange={handleLocationChange} />}
                    label="Lever fra bestemt klasserom (20 Kr ekstra)"
                />
                
                {includeLocation && (
                    <TextField
                    label="Klasserom ID"
                    value={classroomID}
                    onChange={handleClassroomIDChange}
                    inputProps={{ maxLength: 4 }}
                    margin="normal"
                    />
                )}

                <TimePicker
                    label="Velg leveringstid"
                    onChange={(newValue) => setSelectedTime(newValue)}
                />

                <Button variant="contained" color="primary" onClick={handlePayment} disabled={!selectedTime} style={{ marginTop: '20px' }}>
                    Bekreft Betaling
                </Button>
                </Box>
        </Modal>
    </LocalizationProvider>

  );
}
