import axios from 'axios'

export default function BorrowRequest() {

    const BorrowRequest = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                throw new Error("Token not found");
            }
            const config = {
                headers: {
                    "Authorization": token
                }
            };
            const response = await axios.get("http://localhost:8080/api/get-borrow-requests", config);
            console.log("Protected data:", response.data);
        } catch (error) {
            console.error("Error fetching protected data:", error.message);
        }
    }

    return (<><button onClick={BorrowRequest}>Hello</button></>)
}