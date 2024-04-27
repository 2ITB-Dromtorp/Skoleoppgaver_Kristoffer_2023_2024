import axios from 'axios';

export const FetchProtectedData = async (endpoint) => {
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

        const response = await axios.get(endpoint, config);
        return response.data
    } catch (error) {
        console.error('Error fetching data:', error.message);
        throw error; 
    }
};