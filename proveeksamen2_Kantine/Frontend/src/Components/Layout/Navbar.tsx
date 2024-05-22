import { useEffect, useState } from "react";
import { GetUserData } from "../../utils/getUserData";
import { useNavigate } from "react-router-dom";
import { Avatar, Button, Fade, Menu, MenuItem } from "@mui/material";
import { User } from "../../utils/types";

export default function NavBar() {
    const [userdata, setUserData] = useState<User | null>(null);
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

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

    useEffect(() => {
        const fetchUserData = async () => {
            const data = GetUserData();
            setUserData(data);
        };

        fetchUserData();
    }, []);

    const goToShoppingCart = () => {
        navigate('/shopping-cart');
    };

    const goToLogin = () => {
        navigate('/login');
    };

    return (
        <>
            {userdata && (
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
                        <MenuItem onClick={goToShoppingCart}>Shopping Cart</MenuItem>
                        <MenuItem onClick={logout}>Logout</MenuItem>
                    </Menu>
                </div>
            ) : (
            <Button variant="text" onClick={goToLogin}>
                Login
            </Button>
            )}
        </>
    );
}
