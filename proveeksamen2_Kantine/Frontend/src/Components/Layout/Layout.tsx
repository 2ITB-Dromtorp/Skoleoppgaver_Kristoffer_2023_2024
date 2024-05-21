import { Outlet } from 'react-router-dom';
import { CircularProgress } from '@mui/material';
import './Layout.css'

export default function Layout() {

  return (
    <div className='layout'>

      <div className='navbar-container'>
        <CircularProgress />
      </div>

      <div className='content-container'>
        <Outlet />
      </div>

      mekk
    </div>
  );
}