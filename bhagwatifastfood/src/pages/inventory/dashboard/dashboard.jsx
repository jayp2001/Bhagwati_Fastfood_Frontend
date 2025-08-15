import ConsoleCard from "./component/consoleCard/consoleCard";
import './dashboard.css';
import { useNavigate, useLocation, Navigate } from "react-router-dom";
import { useState, useMemo } from "react";
import jwt_decode from 'jwt-decode';
import CryptoJS from 'crypto-js';

const consoleCards = [
    { name: "Inventory", imgName: 'img11', path: '/productList', roles: [1, 2] },
    { name: "Staff Salary", imgName: 'staff', path: '/staff/staffList', roles: [1, 2] },
    { name: "Expense", imgName: 'expense', path: '/expense/dashboard', roles: [1, 2] },
    { name: "Banks", imgName: 'bank', path: '/bank/dashboard', roles: [1, 2] },
    { name: "Business Report", imgName: 'report', path: '/businessReport', roles: [1, 2] },
    { name: "Add User", imgName: 'userAdd', path: '/addUser', roles: [1] },
    { name: "User List", imgName: 'userList', path: '/userTable', roles: [1] },
    { name: "Hotels", imgName: 'hotel', path: '/hotel/hotelTable', roles: [1] },
    { name: "Delivery Console", imgName: 'delivery', path: '/deliveryManagement/Dashboard', roles: [1, 2, 3] },
    { name: "Delivery Man", imgName: 'deliveryMen', path: '/deliveryManagement/DeliveryMan', roles: [1, 2, 3] },
    { name: "Token Ready", imgName: 'mobileView', path: '/deliveryManagement/tokenViewForMobile', roles: [1, 2, 3] },
    { name: "Token Display", imgName: 'scoreboard', path: '/deliveryManagement/tokenView', roles: [1, 2, 3] },
    { name: "Menu", imgName: 'Menu', path: '/menu/Dashboard', roles: [1, 2] },
    { name: "Khata Book", imgName: 'khatabook', path: '/due/account', roles: [1, 2] },
    { name: "Sales Report", imgName: 'sales', path: '/menu/salesReport', roles: [1] },
    { name: "Analyzes", imgName: 'analyze', path: '/category/analyze', roles: [1] }
];
function Dashboard() {
    const navigate = useNavigate();
    const location = useLocation();

    const decryptData = (text) => {
        const key = process.env.REACT_APP_AES_KEY;
        const bytes = CryptoJS.AES.decrypt(text, key);
        return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    };

    const user = JSON.parse(localStorage.getItem('userInfo'));

    // ✅ still safe: hooks always run before return
    const role = user?.userRights ? Number(decryptData(user.userRights)) : null;
    const decoded = user ? jwt_decode(user.token) : null;
    const expirationTime = decoded ? decoded.exp * 1000 - 60000 : null;

    const allowedCards = useMemo(() => {
        if (!role) return [];
        return consoleCards.filter(
            card => !card.roles?.length || card.roles.includes(role)
        );
    }, [role]);

    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    const handleNavigation = (path) => {
        const isTokenValid = expirationTime && new Date(expirationTime) > new Date();
        if (isTokenValid) {
            navigate(path);
        } else {
            if (window.confirm("Session expired. Do you want to Login again ?")) {
                navigate('/login');
            }
        }
    };

    return (
        <div className='mainBody'>
            <div className="cardWrp relative">
                {allowedCards.length > 0 ? (
                    <div className="grid lg:grid-cols-3 mobile:grid-cols-2 tablet1:grid-cols-3 tablet:grid-cols-4 laptop:grid-cols-5 desktop1:grid-cols-6 desktop2:grid-cols-7 desktop2:grid-cols-8 gap-6">
                        {allowedCards.map((card, index) => (
                            <ConsoleCard
                                key={index}
                                goToAddUSer={() => handleNavigation(card.path)}
                                name={card.name}
                                imgName={card.imgName}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-2xl font-bold select-none">
                        You are not Authorised
                    </div>
                )}
            </div>
        </div>
    );
}


export default Dashboard;
