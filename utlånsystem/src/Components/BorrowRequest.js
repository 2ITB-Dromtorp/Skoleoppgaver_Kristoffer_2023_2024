import axios from 'axios';
import React, { useEffect, useState } from 'react';

export default function BorrowRequest() {
  const [borrowRequests, setBorrowRequests] = useState([]);

  // Function to get all borrow requests
  const fetchBorrowRequests = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token not found");
      }
      const config = {
        headers: {
          Authorization: token,
        },
      };
      const response = await axios.get("http://localhost:8080/api/get-borrow-requests", config);
      setBorrowRequests(response.data); 
    } catch (error) {
      console.error("Error fetching borrow requests:", error.message);
    }
  };

  // Function to handle borrowing requests
  const handleBorrowRequest = async (action, equipmentId, studentId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token not found");
      }
      const config = {
        headers: {
          Authorization: token,
        },
      };

      if (action === "accept") {
        await axios.post(
          "http://localhost:8080/api/borrow-accept",
          { equipmentId, studentId },
          config
        );
      } else if (action === "deny") {
        await axios.post(
          "http://localhost:8080/api/borrow-deny",
          { equipmentId },
          config
        );
      }

      // Refetch borrow requests after processing one
      fetchBorrowRequests();
    } catch (error) {
      console.error(`Error processing borrow request (${action}):`, error.message);
    }
  };

  useEffect(() => {
    fetchBorrowRequests(); // Fetch the borrow requests on component mount
  }, []);

  return (
    <div>
      <h2>Borrow Requests</h2>
      {borrowRequests.length === 0 ? (
        <p>No borrow requests</p>
      ) : (
        <ul>
          {borrowRequests.map((request) => (
            <li key={request._id}>
              <p>Equipment ID: {request._id}</p>
              {request.studentsborrowing.map((student) => (
                <p key={student}>Request by: {student}</p>
              ))}
              <button
                onClick={() => handleBorrowRequest("accept", request._id, request.studentsborrowing[0])}
              >
                Accept
              </button>
              <button
                onClick={() => handleBorrowRequest("deny", request._id, request.studentsborrowing[0])}
              >
                Deny
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}