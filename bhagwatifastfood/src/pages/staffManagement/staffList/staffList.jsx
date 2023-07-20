import './staffList.css';
import CountCard from '../../inventory/countCard/countCard'
import EmployeeCard from '../employeeCard/employeeCard';

function StaffList() {
    return (
        <div className='mainBody flex gap-4 pr-4 pl-4'>
            <div className='categoryListContainer'>
                <div className='categoryHeader'>
                    Categories
                    <hr className="hr"></hr>
                </div>
                <div className='categoryListWrp'>
                    <div className='navLink'>
                        All
                    </div>
                    <div className='navLink'>
                        Pay Salary
                    </div>
                    <div className='active'>
                        Panjabi
                    </div>
                    <div className='navLink'>
                        Fast Food
                    </div>
                    <div className='navLink'>
                        Chinese
                    </div>
                </div>
            </div>
            <div className='employeeListContainer'>
                <div className='searchBarAndCardWrp'>
                    <div className='searchBarWrp'>

                    </div>
                    <div className='grid grid-cols-4 gap-6'>
                        <CountCard color={'black'} count={0} desc={'Total Purchase'} productDetail={true} unitDesc={'gm'} />
                        <CountCard color={'black'} count={0} desc={'Total Purchase'} productDetail={true} unitDesc={'gm'} />
                        <CountCard color={'black'} count={0} desc={'Total Purchase'} productDetail={true} unitDesc={'gm'} />
                        <CountCard color={'black'} count={0} desc={'Total Purchase'} productDetail={true} unitDesc={'gm'} />
                    </div>
                </div>
                <div className='employeeListWrp mt-6 pb-6'>
                    <div className='grid grid-cols-2 gap-6'>
                        <EmployeeCard />
                        <EmployeeCard />
                        <EmployeeCard />
                        <EmployeeCard />
                        <EmployeeCard />
                        <EmployeeCard />
                        <EmployeeCard />
                        <EmployeeCard />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default StaffList;