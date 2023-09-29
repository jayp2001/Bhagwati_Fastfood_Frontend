import ConsoleCard from "./component/consoleCard/consoleCard";
import './dashboard.css';
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useLocation, Navigate, Outlet } from "react-router-dom";
import jwt_decode from 'jwt-decode'
import CryptoJS from 'crypto-js'
function Dashboard() {
    const navigate = useNavigate();
    const [value, setValue] = useState({
        startDate: null,
        endDate: null
    });
    const decryptData = (text) => {
        const key = process.env.REACT_APP_AES_KEY;
        const bytes = CryptoJS.AES.decrypt(text, key);
        const data = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        return (data);
    };
    const user = JSON.parse(localStorage.getItem('userInfo'))
    let location = useLocation();
    if (!user) {
        return (<Navigate to="/login" state={{ from: location }} replace />)
    }
    const role = user.userRights ? decryptData(user.userRights) : '';
    const decoded = jwt_decode(user.token);
    const expirationTime = (decoded.exp * 1000) - 60000


    const handleValueChange = (newValue) => {
        console.log("newValue:", newValue);
        setValue(newValue);
    }
    const goToAddUSer = () => {
        // const auth = new Date(expirationTime) > new Date() && role == 6 ? true : false
        // if (auth) {
        //     navigate('/addUser')
        // } else {
        //     if (window.confirm("You are not Authorised. You want to Login again ?")) {
        //         navigate('/login')
        //     }
        // }
        navigate('/addUser')

    }
    const goToStaff = () => {
        const auth = new Date(expirationTime) > new Date() && role == 6 ? true : false
        navigate('/staff/staffList')
    }
    const goToProductList = () => {
        // const auth = new Date(expirationTime) > new Date() && role == 6 ? true : false
        navigate('/productList')
    }
    return (
        <div className='mainBody'>
            <div className="cardWrp">
                <div className="grid lg:grid-cols-3 mobile:grid-cols-2 tablet1:grid-cols-3 tablet:grid-cols-4 laptop:grid-cols-5 desktop1:grid-cols-6 desktop2:grid-cols-7 desktop2:grid-cols-8' gap-6">
                    <ConsoleCard goToAddUSer={goToProductList} name={"Inventory"} imgName={'img11'} />
                    <ConsoleCard goToAddUSer={goToStaff} name={"Staff Salary"} imgName={'staff'} />
                    <ConsoleCard goToAddUSer={goToAddUSer} name={"Add User"} imgName={'userAdd'} />
                </div>
            </div>
        </div>
    )
}

export default Dashboard;