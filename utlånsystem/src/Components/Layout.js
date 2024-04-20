import { Outlet } from 'react-router-dom';
import React from 'react';

export default function Layout() {

  return (
    <div className='layout-container'>

      <div className='navbar-content'>
        navbar
      </div>

      <div className='layout-outlet'>
        <Outlet />
      </div>
    </div>
  );
}