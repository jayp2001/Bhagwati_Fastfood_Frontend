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
import StyleOutlinedIcon from '@mui/icons-material/StyleOutlined';
import ListAltOutlinedIcon from '@mui/icons-material/ListAltOutlined';
import { Navigate, Outlet } from "react-router-dom";
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import EventBusyIcon from '@mui/icons-material/EventBusy';
import jwt_decode from 'jwt-decode'
import CryptoJS from 'crypto-js'
function NavBar() {
    const location = useLocation();
    const decryptData = (text) => {
        const key = process.env.REACT_APP_AES_KEY;
        const bytes = CryptoJS.AES.decrypt(text, key);
        const data = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        return (data);
    };
    const [state, setState] = React.useState({
        left: false,
    });
    const user = JSON.parse(localStorage.getItem('userInfo'))
    var greetMsg = 'Hello';
    var data = [
        [22, 'Working late'],
        [18, 'Good evening'],
        [12, 'Good afternoon'],
        [5, 'Good morning'],
        [0, 'Whoa, early bird']
    ],
        hr = new Date().getHours();
    for (var i = 0; i < data.length; i++) {
        if (hr >= data[i][0]) {
            greetMsg = data[i][1];
            break;
        }
    }

    const toggleDrawer = (anchor, open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }

        setState({ ...state, [anchor]: open });
    };
    console.log("location", location.pathname.split('/')[1])
    const list = (anchor) => (
        <Box
            sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 300, color: 'gray' }}
            role="presentation"
            onClick={toggleDrawer(anchor, false)}
            onKeyDown={toggleDrawer(anchor, false)}
        >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', backgroundColor: '#333', color: '#fff' }}>
                <div style={{ fontSize: 35 }}><InventoryIcon fontSize='large' />&nbsp;&nbsp;{location.pathname.split('/')[1] == 'staff' ? 'Employes' : 'Inventory'}</div>
                <Button onClick={toggleDrawer(anchor, false)} color="inherit">
                    <ArrowBackIcon fontSize='small' />
                </Button>
            </Box>
            <Divider />
            <List>
                {location.pathname.split('/')[1] == 'staff' ?
                    <>
                        <ListItem key={'staff1'}>
                            <ListItemButton to="/dashboard">
                                <ListItemIcon>
                                    <DashboardIcon />
                                </ListItemIcon>
                                <ListItemText primary={'Dashboard'} />
                            </ListItemButton>
                        </ListItem>
                        <ListItem key={'staff2'}>
                            <ListItemButton to="/staff/staffList">
                                <ListItemIcon>
                                    <StyleOutlinedIcon />
                                </ListItemIcon>
                                <ListItemText primary={'Staff List'} />
                            </ListItemButton>
                        </ListItem>
                        <ListItem key={'staff5'}>
                            <ListItemButton to="/staff/addStaff">
                                <ListItemIcon>
                                    <GroupAddIcon />
                                </ListItemIcon>
                                <ListItemText primary={'Add Staff'} />
                            </ListItemButton>
                        </ListItem>
                        <ListItem key={'staff6'}>
                            <ListItemButton to="/staff/allPayments">
                                <ListItemIcon>
                                    <AccountBalanceWalletIcon />
                                </ListItemIcon>
                                <ListItemText primary={'All Payments'} />
                            </ListItemButton>
                        </ListItem>
                        <ListItem key={'staff6'}>
                            <ListItemButton to="/staff/leaves">
                                <ListItemIcon>
                                    <EventBusyIcon />
                                </ListItemIcon>
                                <ListItemText primary={'Leaves'} />
                            </ListItemButton>
                        </ListItem>
                        <ListItem key={'staff3'}>
                            <ListItemButton to="/staff/staffCategory">
                                <ListItemIcon>
                                    <ListAltOutlinedIcon />
                                </ListItemIcon>
                                <ListItemText primary={'Staff Categorires Table'} />
                            </ListItemButton>
                        </ListItem>
                    </>
                    :
                    <>
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
                                    <StyleOutlinedIcon />
                                </ListItemIcon>
                                <ListItemText primary={'Products'} />
                            </ListItemButton>
                        </ListItem>
                        <ListItem key={9}>
                            <ListItemButton to="/productTable">
                                <ListItemIcon>
                                    <ListAltOutlinedIcon />
                                </ListItemIcon>
                                <ListItemText primary={'Product Table'} />
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
                    </>
                }
            </List>
        </Box>
    );

    const navigate = useNavigate();
    const logout = () => {
        if (window.confirm("Are you sure !,you want to logout")) {
            localStorage.removeItem('userInfo');
            navigate(`/login`)
        }
    }
    if (location.pathname.toLowerCase() === "/login") {
        return null;
    }
    if (!user) {
        return (<Navigate to="/login" state={{ from: location }} replace />)
    }
    const role = user.userRights ? decryptData(user.userRights) : '';

    return (
        <div className="navBar grid content-center">
            <div className='flex justify-between h-full'>
                <div className='logoWrp flex h-full'>
                    {
                        role != 6 ?
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
                            </div> : null
                    }
                    <div>
                        <img className='headerImg' src={bhagwatiHeaderLogo} alt='No Image Found' />
                    </div>
                </div>
                <div className='logoutWrp flex justify-end'>
                    <div className='greeting h-full grid content-center mr-24'>
                        {role != 6 ? greetMsg + ', ' + user?.userName : ''}
                    </div>
                    <button className='h-full grid content-center' onClick={logout}>
                        <LogoutIcon fontSize='medium' />
                    </button>
                </div>
            </div>
        </div>
    )
}
export default NavBar;