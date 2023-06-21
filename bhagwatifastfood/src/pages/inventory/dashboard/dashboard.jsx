import ConsoleCard from "./component/consoleCard/consoleCard";
import './dashboard.css';
import { useNavigate } from "react-router-dom";
function Dashboard() {
    const navigate = useNavigate();

    const goToAddUSer = () => {
        // console.log(">>>");
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