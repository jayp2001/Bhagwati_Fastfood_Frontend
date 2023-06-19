import './nav.css'
import bhagwatiHeaderLogo from '../../assets/bhagwatiHeaderLogo.png';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from "react-router-dom";
import { useLocation } from 'react-router-dom';

function NavBar() {
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
                        <MenuIcon fontSize='large' />
                    </div>
                    <div>
                        <img className='headerImg' src={bhagwatiHeaderLogo} />
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