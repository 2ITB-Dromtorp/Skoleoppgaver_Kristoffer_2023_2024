import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useState } from "react";
import { Avatar, Button, Fade, Menu, MenuItem, Typography, Tabs, Tab } from "@mui/material";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import ListAltIcon from '@mui/icons-material/ListAlt';
import HomeIcon from '@mui/icons-material/Home';
import { User } from "../../utils/types";
import './Layout.css';

interface LayoutProps {
  userdata: User | null;
  setUserData: (user: User | null) => void;
}

export default function Layout({ userdata, setUserData }: LayoutProps) {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [selectedTab, setSelectedTab] = useState<string>("/");

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUserData(null);
    navigate('/login');
  };

  const handleTabChange = (_: React.SyntheticEvent, newValue: string) => {
    setSelectedTab(newValue);
    navigate(newValue);
  };

  return (
    <div className='layout-container'>
      <div className='navbar-content'>
        <div className='icon'>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Drømtorp Kantine
          </Typography>
          <ShoppingBagIcon />
        </div>

        <Tabs value={selectedTab} onChange={handleTabChange} aria-label="nav tabs">
          <Tab label="Hjem" value="/" icon={<HomeIcon />} component={Link} to="/" />
          <Tab
            label="Handlekurv"
            value="/cart"
            icon={<ShoppingCartIcon />}
            iconPosition="start"
            component={Link}
            to="/cart"
          />
          <Tab
            label="Dine bestillinger"
            value="/orders"
            icon={<ListAltIcon />}
            iconPosition="start"
            component={Link}
            to="/orders"
          />
        </Tabs>

        {userdata ? (
          <div className="user-info">
            <Avatar>{userdata.FirstName[0]}{userdata.LastName[0]}</Avatar>
            <Button variant="text" onClick={handleClick}>
              {userdata.FirstName}
            </Button>
            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              TransitionComponent={Fade}
              className="avatar-button"
            >
              <MenuItem onClick={logout}>Logout</MenuItem>
            </Menu>
          </div>
        ) : (
          <Button onClick={() => navigate('/login')}>Login</Button>
        )}
      </div>
      <div className='content-container'>
        <Outlet />
      </div>
    </div>
  );
}
