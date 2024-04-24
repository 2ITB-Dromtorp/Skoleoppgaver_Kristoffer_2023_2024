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
            getEquipments();
        } catch (error) {
            console.error('Error borrowing equipment:', error.message);
        }
    };

    return (
        <>
            <div className='grid grid-cols-4 gap-4 p-5 text-center w-max '>
                {equipmentData.length > 0 &&
                    equipmentData.map((equipment) => (
                        <div className={equipment.BorrowStatus.currentStatus !== "borrowed" ? (equipment.BorrowStatus.currentStatus === "available" ? "bg-green-600 shadow-md" : "bg-yellow-600 shadow-lg")  : "bg-red-600 shadow-lg"} key={equipment._id}>
                            <p>Serial Number: {equipment._id}</p>
                            <p>Type: {equipment.Type}</p>
                            <p>Model: {equipment.Model}</p>
                            <div className='flex flex-row gap-3 justify-center'>
                                {equipment.Specs.map((spec) => {
                                    return (<p className='bg-gray-200 w-max'>{spec}</p>)
                                })}
                            </div>
                            {equipment.BorrowStatus.currentStatus === "pending" ? <p>someone is requesting</p> : <span></span>}
                            {equipment.BorrowStatus.currentStatus !== "borrowed" ? equipment.BorrowStatus.currentStatus === "available" ? <button className='border-4 border-sky-500' onClick={() => handleBorrowRequest(equipment._id)}>Borrow</button> : <span></span> : <div>
                        
                                <p>Borrowed by {equipment.BorrowStatus.studentsborrowing[0]}</p>

                                </div>}
                        </div>
                    ))}
            </div>
        </>
    );
}