import { useState, useEffect, useCallback } from "react";
import { Button, Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";
import axios from 'axios'
import { FetchProtectedData } from "../../utils/FetchProtectedData";
import { useAlert } from "../../utils/useAlert";

export default function TeacherHomePage() {
    const [borrowedEquipments, setBorrowedEquipments] = useState()
    const { setAlert } = useAlert();

    const fetchEquipments = useCallback(async () => {
        try {
            const data = await FetchProtectedData('/api/get-equipments');
            const borrowed = data.filter(
                (equipment) => equipment.BorrowStatus.currentStatus === "borrowed"
            );
            setBorrowedEquipments(borrowed);
        } catch (error) {
            const errorMessage = error.response?.data?.error || 'En uventet feil oppstod.';
            setAlert({ message: errorMessage, type: 'error' })
        }
    }, [setAlert]);

    useEffect(() => {
        fetchEquipments()
    }, [fetchEquipments]);

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
            setAlert({ message: "Fjernet lånt forespørsel til en bruken", type: 'success' })
            fetchEquipments()
        } catch (error) {
            const errorMessage = error.response?.data?.error || 'En uventet feil oppstod.';
            setAlert({ message: errorMessage, type: 'error' })
        }
    }

    return (
        <div>
            {borrowedEquipments &&
                <Table className="equipment-table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Serienummer</TableCell>
                            <TableCell>Model</TableCell>
                            <TableCell>Type</TableCell>
                            <TableCell>Lånt av</TableCell>
                            <TableCell>Handlinger</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {borrowedEquipments.map((equipment) => (
                            <TableRow key={equipment._id}>
                                <TableCell>{equipment._id}</TableCell>
                                <TableCell>{equipment.Model}</TableCell>
                                <TableCell>{equipment.Type}</TableCell>
                                <TableCell>
                                    {equipment.BorrowStatus.studentsborrowing.map((student) => student.firstname).join(', ')}
                                </TableCell>
                                <TableCell>
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        onClick={() => handleRemoveBorrow(equipment._id)}
                                    >
                                        Fjern
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