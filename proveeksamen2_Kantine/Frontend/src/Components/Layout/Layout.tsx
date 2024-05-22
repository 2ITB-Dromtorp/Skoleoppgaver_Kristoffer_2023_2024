import { Outlet } from 'react-router-dom';
import './Layout.css'
import NavBar from './Navbar';

export default function Layout() {

  return (
    <div className='layout'>

      <div className='navbar-container'>
        <NavBar />
      </div>

      <div className='content-container'>
        <Outlet />
      </div>

    </div>
  );
}