import { useEffect } from 'react';
import { jwtDecode } from "jwt-decode";

const CheckUserRole = (expectedRole, navigate) => {

  useEffect(() => {
    const token = localStorage.getItem('token'); 

    if (!token) {
      navigate('/');
      return;
    }

    try {
      const decoded = jwtDecode(token);

      const userRole = decoded.userdata.role;
      if (userRole !== expectedRole) {
        navigate('/');
      }
    } catch (error) {
      console.error('Error decoding token:', error);
      navigate('/');
    }
  }, [expectedRole, navigate]);
}
export default CheckUserRole;