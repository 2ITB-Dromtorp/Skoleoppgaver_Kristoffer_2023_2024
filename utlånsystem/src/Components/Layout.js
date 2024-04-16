import {Outlet} from 'react-router-dom';
import React, { useContext, useEffect } from 'react';

export default function Layout() {

    return (
      <div className='layout-container'>

        <div className='navbar-content'>
        Test
        </div>

        <div className='layout-outlet'>
            <Outlet/>
        </div>
      </div>
    );
}