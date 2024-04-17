import { Outlet } from 'react-router-dom';
import React from 'react';
import CheckAuth from '../Functions/CheckAuth';

export default function Layout() {
  const { isLoggedIn, logout } = CheckAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className='layout-container'>

      <div className='navbar-content'>
        {isLoggedIn ? (
          <>
            <p>Welcome, user</p>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <p>Please login</p>
        )}
      </div>

      <div className='layout-outlet'>
        <Outlet />
      </div>
    </div>
  );
}