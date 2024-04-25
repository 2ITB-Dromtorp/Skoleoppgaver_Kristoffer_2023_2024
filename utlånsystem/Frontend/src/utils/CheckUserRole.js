import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import jwtDecode from 'jwt-decode';

const checkUserRole = (expectedRole) => {
  const navigate = useNavigate();

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
export default checkUserRole;