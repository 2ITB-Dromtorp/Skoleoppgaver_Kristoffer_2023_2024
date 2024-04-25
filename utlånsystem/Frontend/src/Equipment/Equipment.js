import axios from 'axios';
import { useState, useEffect } from 'react';
import { FetchProtectedData } from '../utils/FetchProtectedData';
import {
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    Button,
    Pagination,
    TextField,
    Alert,
  } from '@mui/material';


  
import './Equipment.css';

export default function Equipment() {
    const [equipmentData, setEquipmentData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(8);

    useEffect(() => {
        fetchEquipments()
    }, []);

    const fetchEquipments = async () => {
        try {
            const data = await FetchProtectedData('http://localhost:8080/api/get-equipments');
            setEquipmentData(data);

        } catch (error) {
            console.error('Error fetching equipment data:', error.message);
        }
    };

    const handleBorrowRequest = async (equipmentId) => {
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
            await axios.post('http://localhost:8080/api/borrow-request', { equipmentId }, config);
            fetchEquipments();
        } catch (error) {
            console.error('Error borrowing equipment:', error.message);
        }
    };

    const totalPages = Math.ceil(equipmentData.length / itemsPerPage);

    const currentData = equipmentData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handlePageChange = (_event, page) => {
        setCurrentPage(page);
    };
    

    return (
        <div className='equipment-container'>

            <TextField id="outlined-basic" label="Søk" variant="outlined" />

            <Table className='equipment-table'>
                <TableHead>
                <TableRow>
                    <TableCell>Serial Number</TableCell>
                    <TableCell>Model</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Specs</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                </TableRow>
                </TableHead>
                <TableBody>
                {currentData.map((equipment) => (
                    <TableRow key={equipment._id}>
                    <TableCell>{equipment._id}</TableCell>
                    <TableCell>{equipment.Model}</TableCell>
                    <TableCell>{equipment.Type}</TableCell>
                    <TableCell>{equipment.Specs}</TableCell> 
                    <TableCell>{equipment.BorrowStatus.currentStatus}</TableCell>
                    <TableCell>
                        {equipment.BorrowStatus.currentStatus === "available" && <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleBorrowRequest(equipment._id)}
                        >
                        Borrow
                        </Button>}
                        {equipment.BorrowStatus.currentStatus === "borrowed" && <Button
                        variant="contained"
                        disabled
                        color="primary"
                        onClick={() => handleBorrowRequest(equipment._id)}
                        >
                        Borrow
                        </Button>}
                        {equipment.BorrowStatus.currentStatus === "pending" && <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleBorrowRequest(equipment._id)}
                        >
                        Borrow
                        </Button>}
                    </TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>

            <div className="pagination-container">
                <Pagination
                    count={totalPages}
                    page={currentPage}
                    onChange={handlePageChange}
                    color="primary"
                />
            </div>
        </div>
    );
}