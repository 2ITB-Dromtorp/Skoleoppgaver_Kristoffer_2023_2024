import axios from 'axios';
import { useState, useEffect } from 'react';

export default function Equipment() {
    const [equipmentData, setEquipmentData] = useState([]);

    useEffect(() => {
        getEquipments();
    }, []);

    const getEquipments = async () => {
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
            const response = await axios.get('http://localhost:8080/api/get-equipments', config);
            setEquipmentData(response.data);
        } catch (error) {
            console.error('Error fetching protected data:', error.message);
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
        } catch (error) {
            console.error('Error borrowing equipment:', error.message);
        }
    };

    return (
        <>
            {equipmentData.length > 0 &&
                equipmentData.map((equipment) => (
                    <div key={equipment._id}>
                        <p>Serial Number: {equipment._id}</p>
                        <p>Type: {equipment.Type}</p>
                        <p>Model: {equipment.Model}</p>
                        {/* Add more fields as needed */}
                        <button onClick={() => handleBorrowRequest(equipment._id)}>Borrow</button>
                    </div>
                ))}
        </>
    );
}