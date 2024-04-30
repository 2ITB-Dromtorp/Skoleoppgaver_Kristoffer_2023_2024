import axios from 'axios';
import { useState, useEffect, useCallback  } from 'react';
import { FetchProtectedData } from '../../utils/FetchProtectedData';
import {
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    Button,
    Pagination,
    TextField,
    Select,
    FormControl,
    InputLabel,
    MenuItem,
    Typography,
    CircularProgress,
    IconButton
} from '@mui/material';
import { useAlert } from "../../utils/useAlert";

import { Delete } from '@mui/icons-material';


import { GetUserData } from '../../utils/GetUserData';

import './Equipment.css';


export default function Equipment() {
    const [equipmentData, setEquipmentData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(3);
    const [searchQuery, setSearchQuery] = useState('');
    const [filter, setFilter] = useState('');
    const [userdata, setUserData] = useState()
    const { setAlert } = useAlert();

    const [statusCounts, setStatusCounts] = useState({
        total: 0,
        available: 0,
        pending: 0,
        borrowed: 0,
    });

    const fetchEquipments = useCallback(async () => {
        try {
            const data = await FetchProtectedData('/api/get-equipments');
            setEquipmentData(data);

            const total = data.length;
            const available = data.filter((equipment) => equipment.BorrowStatus.currentStatus === 'available').length;
            const pending = data.filter((equipment) => equipment.BorrowStatus.currentStatus === 'pending').length;
            const borrowed = data.filter((equipment) => equipment.BorrowStatus.currentStatus === 'borrowed').length;

            setStatusCounts({ total, available, pending, borrowed });
        } catch (error) {
            const errorMessage = error.response?.data?.error || 'En uventet feil oppstod.';
            setAlert({ message: errorMessage, type: 'error' });
        }
    }, [setAlert]);

    useEffect(() => {
        const fetchUserData = async () => {
            const data = await GetUserData();
            setUserData(data);
        };

        fetchUserData();

        fetchEquipments()
    }, [fetchEquipments]);

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
            const response = await axios.post('/api/borrow-request', { equipmentId }, config);
            
            setAlert({ message: response.data.message, type: 'success'})
            fetchEquipments();

        } catch (error) {
            const errorMessage = error.response?.data?.error || 'En uventet feil oppstod.';
            setAlert({ message: errorMessage, type: 'error'})
        }
    };

    const handleRemoveEquipment = async (equipmentId) => {
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
            await axios.put('/api/remove-equipment', { equipmentId }, config);
            setAlert({ message: "Utstyr fjernet", type: 'success'})
            fetchEquipments();
        } catch (error) {
            const errorMessage = error.response?.data?.error || 'En uventet feil oppstod.';
            setAlert({ message: errorMessage, type: 'error'})
        }
    }

    const filteredData = equipmentData.filter((equipment) => {
        if (filter && equipment.BorrowStatus.currentStatus !== filter) {
            return false;
        }
        if (
            searchQuery &&
            !(
                equipment._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                equipment.Model.toLowerCase().includes(searchQuery.toLowerCase()) ||
                equipment.Type.toLowerCase().includes(searchQuery.toLowerCase())
            )
        ) {
            return false;
        }
        return true;
    });

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    const currentData = filteredData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handlePageChange = (_event, page) => {
        setCurrentPage(page);
    };

    const handleFilterChange = (e) => {
        setFilter(e.target.value);
        setCurrentPage(1);
    }

    const handleTextChange = (e) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1);
    }

    return (
        <div className='equipment-container'>

            <div className='status-summary'>
                <Typography variant="h4">Status</Typography>
                <Typography variant="h5">Totalt: {statusCounts.total}</Typography>
                <Typography variant="h5">Tilgjengelig: {statusCounts.available}</Typography>
                <Typography variant='h5'>Venter på forespørsel: {statusCounts.pending}</Typography>
                <Typography variant='h5'>Lånt: {statusCounts.borrowed}</Typography>

            </div>


            <div className='table-container'>

                <div className='searchandfilter'>

                    <FormControl fullWidth>
                        <InputLabel>Status Filter</InputLabel>
                        <Select
                            label="Status Filter"
                            value={filter}
                            onChange={handleFilterChange}
                        >
                            <MenuItem value="">Alle</MenuItem>
                            <MenuItem value="available">Tilgjengelig</MenuItem>
                            <MenuItem value="borrowed">Lånt</MenuItem>
                            <MenuItem value="pending">Venter på forespørsel</MenuItem>
                        </Select>
                    </FormControl>

                    <TextField
                        id="outlined-basic"
                        label="Search"
                        variant="outlined"
                        value={searchQuery}
                        onChange={handleTextChange}
                    />

                </div>


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
                                <TableCell>{equipment.Specs.join(', ')}</TableCell>
                                <TableCell>

                                    {equipment.BorrowStatus.currentStatus === "pending" && (<p className='pending'> Noen har spørt om forespørsel </p>)}

                                    {equipment.BorrowStatus.currentStatus === "available" && (<p className='available'>Tilgjengelig</p>)}

                                    {equipment.BorrowStatus.currentStatus === "borrowed" && (<p className='borrowed'>Lånt</p>)}

                                </TableCell>
                                <TableCell>
                                    <div className='button-container'>
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
                                        </Button>
                                        }
                                        {userdata ? (
                                            <>
                                                {userdata.role === "Teacher" && <IconButton onClick={() => handleRemoveEquipment(equipment._id)} edge="end">
                                                    <Delete />
                                                </IconButton>}
                                            </>
                                        ) : (
                                            <CircularProgress />
                                        )}
                                    </div>
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

        </div>
    );
}