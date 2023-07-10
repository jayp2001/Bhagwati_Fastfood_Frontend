import './nav.css'
import bhagwatiHeaderLogo from '../../assets/bhagwatiHeaderLogo.png';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from "react-router-dom";
import { useLocation } from 'react-router-dom';
import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InventoryIcon from '@mui/icons-material/Inventory';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ListAltIcon from '@mui/icons-material/ListAlt';
import DomainAddIcon from '@mui/icons-material/DomainAdd';
import DashboardIcon from '@mui/icons-material/Dashboard';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import CategoryIcon from '@mui/icons-material/Category';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';

function NavBar() {
    const [state, setState] = React.useState({
        left: false,
    });

    const toggleDrawer = (anchor, open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }

        setState({ ...state, [anchor]: open });
    };

    const list = (anchor) => (
        <Box
            sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 300, color: 'gray' }}
            role="presentation"
            onClick={toggleDrawer(anchor, false)}
            onKeyDown={toggleDrawer(anchor, false)}
        >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', backgroundColor: '#333', color: '#fff' }}>
                <div style={{ fontSize: 35 }}><InventoryIcon fontSize='large' />&nbsp;&nbsp;Inventory</div>
                <Button onClick={toggleDrawer(anchor, false)} color="inherit">
                    <ArrowBackIcon fontSize='small' />
                </Button>
            </Box>
            <Divider />
            <List>
                <ListItem key={1}>
                    <ListItemButton to="/dashboard">
                        <ListItemIcon>
                            <DashboardIcon />
                        </ListItemIcon>
                        <ListItemText primary={'Dashboard'} />
                    </ListItemButton>
                </ListItem>
                <ListItem key={2}>
                    <ListItemButton to="/productList">
                        <ListItemIcon>
                            <ListAltIcon />
                        </ListItemIcon>
                        <ListItemText primary={'Products'} />
                    </ListItemButton>
                </ListItem>
                <ListItem key={3}>
                    <ListItemButton to="/stockInOut">
                        <ListItemIcon>
                            <CompareArrowsIcon />
                        </ListItemIcon>
                        <ListItemText primary={'Stock In/Out'} />
                    </ListItemButton>
                </ListItem>
                <ListItem key={4}>
                    <ListItemButton to="/suppilerTable">
                        <ListItemIcon>
                            <DomainAddIcon />
                        </ListItemIcon>
                        <ListItemText primary={'Suppliers'} />
                    </ListItemButton>
                </ListItem>
                <ListItem key={5}>
                    <ListItemButton to="/categories">
                        <ListItemIcon>
                            <CategoryIcon />
                        </ListItemIcon>
                        <ListItemText primary={'Categories'} />
                    </ListItemButton>
                </ListItem>
                <ListItem key={6}>
                    <ListItemButton to="/transactionTable">
                        <ListItemIcon>
                            <AccountBalanceWalletIcon />
                        </ListItemIcon>
                        <ListItemText primary={'Transaction History'} />
                    </ListItemButton>
                </ListItem>
            </List>
        </Box>
    );

    const navigate = useNavigate();
    const location = useLocation();
    const logout = () => {
        if (window.confirm("Are you sure !,you want to logout")) {
            localStorage.removeItem('userInfo');
            navigate(`/login`)
        }
    }
    if (location.pathname.toLowerCase() === "/login") {
        return null;
    }

    return (
        <div className="navBar grid content-center">
            <div className='flex justify-between h-full'>
                <div className='logoWrp flex h-full'>
                    <div className='h-full grid content-center'>
                        <div>
                            {['left'].map((anchor) => (
                                <React.Fragment key={anchor}>
                                    <Button onClick={toggleDrawer(anchor, true)}><MenuIcon fontSize='large' style={{ color: 'black' }} /></Button>
                                    <Drawer
                                        anchor={anchor}
                                        open={state[anchor]}
                                        onClose={toggleDrawer(anchor, false)}
                                    >
                                        {list(anchor)}
                                    </Drawer>
                                </React.Fragment>
                            ))}
                        </div>
                    </div>
                    <div>
                        <img className='headerImg' src={bhagwatiHeaderLogo} alt='No Image Found' />
                    </div>
                </div>
                <div className='logoutWrp'>
                    <button className='h-full grid content-center' onClick={logout}>
                        <LogoutIcon fontSize='medium' />
                    </button>
                </div>
            </div>
        </div>
    )
}
export default NavBar;