import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from "react";
import { Avatar, Button, Fade, Menu, MenuItem, Typography, Tabs, Tab } from "@mui/material";
import ListAltIcon from '@mui/icons-material/ListAlt';
import HomeIcon from '@mui/icons-material/Home';
import { User } from "../../utils/types";
import './Layout.css';
import ScoreboardIcon from '@mui/icons-material/Scoreboard';

import { ThemeProvider, createTheme} from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: "#FFFFFF",
    },
    secondary: {
      main: "#FFFFFF",
    },
  },
});

interface LayoutProps {
  userdata: User | null;
  setUserData: (user: User | null) => void;
}

export default function Layout({ userdata, setUserData }: LayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [selectedTab, setSelectedTab] = useState<string>("");

  useEffect(() => {
    setSelectedTab(location.pathname);
  }, [location.pathname]);

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
      <ThemeProvider theme={theme}>
        <div className='navbar-content'>
          <img className='h-full' src='/ballillogo.png'></img>

          {userdata && <Tabs value={selectedTab} onChange={handleTabChange} aria-label="nav tabs">
            <Tab label="Hjem" value="/" icon={<HomeIcon />} iconPosition="start" component={Link} to="/" />
            <Tab
              label="Turneringer"
              value="/tournaments"
              icon={<ScoreboardIcon />}
              iconPosition="start"
              component={Link}
              to="/tournaments"
            />
            <Tab
              label="Dine Påmeldinger"
              value="/registered"
              icon={<ListAltIcon />}
              iconPosition="start"
              component={Link}
              to="/registered"
            />
          </Tabs>}

          {userdata? (
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
      </ThemeProvider>

      <div className='content-container'>
        <Outlet />
      </div>
    </div>
  );
}
