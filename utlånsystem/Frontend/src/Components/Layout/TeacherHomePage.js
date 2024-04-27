import { useState, useEffect } from "react";
import { Button, Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";
import axios from 'axios'
import { FetchProtectedData } from "../../utils/FetchProtectedData";


export default function TeacherHomePage() {
    const [borrowedEquipments, setBorrowedEquipments] = useState()

    useEffect(() => {
        fetchEquipments()
    }, []);

    const fetchEquipments = async () => {
        try {
            const data = await FetchProtectedData('/api/get-equipments');
            const borrowed = data.filter(
                (equipment) => equipment.BorrowStatus.currentStatus === "borrowed"
              );
              setBorrowedEquipments(borrowed);
        } catch (error) {
            console.error('Error fetching equipment data:', error.message);
        }
    };

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
            fetchEquipments()
        } catch (error) {
            console.error('Error removing data', error.message);
        }
    }

    return (
        <div>
            {borrowedEquipments &&
            <Table className="equipment-table">
            <TableHead>
            <TableRow>
                <TableCell>Serial Number</TableCell>
                <TableCell>Model</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Borrowed By</TableCell>
                <TableCell>Actions</TableCell>
            </TableRow>
            </TableHead>
            
            <TableBody>
            {borrowedEquipments.map((equipment) => (
                <TableRow key={equipment._id}>
                <TableCell>{equipment._id}</TableCell>
                <TableCell>{equipment.Model}</TableCell>
                <TableCell>{equipment.Type}</TableCell>
                <TableCell>
                    {equipment.BorrowStatus.studentsborrowing.map((student) => (
                    <span key={student.email}>{student.firstname} {student.lastname}</span>
                    ))}
                </TableCell>
                <TableCell>
                    <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleRemoveBorrow(equipment._id)}
                    >
                    Remove
                    </Button>
                </TableCell>
                </TableRow>
            ))}
            </TableBody>
            </Table>
            }
            
        </div>
    )
}