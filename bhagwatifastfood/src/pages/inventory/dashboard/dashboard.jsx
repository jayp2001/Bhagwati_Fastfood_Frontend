import ConsoleCard from "./component/consoleCard/consoleCard";
import './dashboard.css'
function Dashboard() {
    return (
        <div className='mainBody'>
            <div className="cardWrp">
                <div className="grid lg:grid-cols-6 md:grid-cols-4 sm:grid-cols-3 gap-6">
                    <ConsoleCard name={"Inventory"} imgName={'deliveryBoyLogo'} />
                </div>
            </div>
        </div>
    )
}

export default Dashboard;