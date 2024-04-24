import { Outlet } from 'react-router-dom';

export default function Layout() {

  return (
    <div className='layout-container'>

      <div className='navbar-content'>
        navbar
      </div>

      <div className='layout-outlet'>
        <Outlet />
      </div>

      <div className='footer'>
        footer
      </div>
    </div>
  );
}