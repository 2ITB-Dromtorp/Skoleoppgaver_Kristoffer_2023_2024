import { Outlet } from 'react-router-dom';
import Footer from './Footer';
import { CircularProgress } from '@mui/material';

export default function Layout() {

  return (
    <div className='layout'>

      <div className='navbar-container'>
        <CircularProgress />
      </div>

      <div className='content-container'>
        <Outlet />
      </div>

      <Footer />
    </div>
  );
}