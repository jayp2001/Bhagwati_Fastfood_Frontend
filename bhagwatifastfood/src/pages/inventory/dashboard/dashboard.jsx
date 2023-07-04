import ConsoleCard from "./component/consoleCard/consoleCard";
import './dashboard.css';
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
function Dashboard() {
    const navigate = useNavigate();
    const [value, setValue] = useState({
        startDate: null,
        endDate: null
    });

    const handleValueChange = (newValue) => {
        console.log("newValue:", newValue);
        setValue(newValue);
    }
    const goToAddUSer = () => {
        navigate('/addUser')
    }
    return (
        <div className='mainBody'>
            <div className="cardWrp">
                <div className="grid lg:grid-cols-6 md:grid-cols-4 sm:grid-cols-3 gap-6">
                    <ConsoleCard goToAddUSer={goToAddUSer} name={"Inventory"} imgName={'deliveryBoyLogo'} />
                </div>
            </div>
        </div>
    )
}

export default Dashboard;