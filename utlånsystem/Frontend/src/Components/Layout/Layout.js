import React, { useEffect, useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { GetUserData } from '../../utils/GetUserData';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/dromtorplogo.png'

import './Layout.css'

import {Button, Avatar, Menu, MenuItem, Fade, Tabs, Tab} from '@mui/material'


export default function Layout() {
  const [userdata, setUserData] = useState(null);
  const [activeTab, setActiveTab] = useState(0);

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };


  const navigate = useNavigate()

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/login'); 
  };

  const handleTabs = (event, newValue) => {
    setActiveTab(newValue); 

    console.log(newValue)

    switch (newValue) {
      case 0:
        navigate('/');
        break;
      case 1:
        navigate('/equipments');
        break;
      default:
        navigate('/');
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      const data = await GetUserData(navigate);
      setUserData(data);
    };

    fetchUserData();
  }, [navigate]);

  const userRole = userdata ? userdata.role : null; 

  return (
    <div className='layout-container'>
      <div className='navbar-content'>

      <img src={logo}></img>

      <div className="navbar-links">
          {userRole === 'Teacher' && (
            <>
              <Link to="/addEquip">Add Equipment</Link>
              <Link to="/equipments">Equipment</Link>
              <Link to="/borrow">Borrow</Link>
              <Link to="/">Home</Link>
            </>
          )}
          {userRole === 'Student' && (
            <Tabs value={activeTab} onChange={handleTabs}>
              <Tab label="Hjem" />
              <Tab label="Utstyr" />
            </Tabs>
          )}
        </div>

        {userdata && (
          <div className="user-info">
            <Avatar>{userdata.contact_info.firstname[0]}{userdata.contact_info.lastname[0]}</Avatar>
            <Button
              id="fade-button"
              aria-controls={open ? 'fade-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
              variant="text"
              onClick={handleClick}
            >
              {userdata.contact_info.firstname}
          </Button>
          <Menu
            id="fade-menu"
            MenuListProps={{
              'aria-labelledby': 'fade-button',
            }}
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            TransitionComponent={Fade}
            className="avatar-button"
          >
            <MenuItem onClick={logout}>Logout</MenuItem>
          </Menu>
          </div>
        )}
      </div>



      <div className='layout-outlet'>
        <Outlet />
      </div>
    </div>
  );
}