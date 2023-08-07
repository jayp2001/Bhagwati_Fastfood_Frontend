import { Tooltip } from '@mui/material';
import './employeeCard.css';
import Menutemp from './menu';
import { BACKEND_BASE_URL } from '../../../url';
import Switch from '@mui/material/Switch';
function EmployeeCard(props) {
    const handleEdit = () => {
        props.handleEditEmployee(props.data.employeeId)
    }
    const handleDelete = () => {
        props.handleDeleteEmployee(props.data.employeeId);
    }
    const label = { inputProps: { 'aria-label': 'Size switch demo' } };
    return (
        <div className='employeeCard' key={props.data.employeeId + 'employeeCard'}>
            <div className='flex h-full'>
                <div className='imgNameWrp'>
                    <div className='imgWrpCard'>
                        <img src={BACKEND_BASE_URL + props.data.imageLink} />
                    </div>
                    <div className='nameAndCategoryWrp'>
                        <Tooltip title={'Vikalp Dipakbhai Chavda'} placement="top-start" arrow>
                            <div className='nameWrp'>
                                {props.data.employeeName}
                            </div>
                        </Tooltip>
                        <Tooltip title={'Panjabi(main)'} placement="top-start" arrow>
                            <div className='categoryWrp'>
                                {props.data.category}
                            </div>
                        </Tooltip>
                    </div>
                </div>
                <div className='salaryDetailContainer w-full'>
                    <div className='flex editBtnWrp justify-between'>
                        <div>
                            <Switch {...label} defaultChecked />
                        </div>
                        <Menutemp handleDelete={handleDelete} handleEdit={handleEdit} />
                    </div>
                    <div className='salaryDetailWrp grid grid-cols-3 gap-4'>
                        <div>
                            <div className='salaryHeader'>
                                Salary
                            </div>
                            <div className='salaryNum mt-1'>
                                {props.data.salary}
                            </div>
                        </div>
                        <div>
                            <div className='salaryHeader'>
                                Advanced
                            </div>
                            <div className='salaryNum mt-1'>
                                {props.data.advanceAmount}
                            </div>
                        </div>
                        <div>
                            <div className='salaryHeader'>
                                Fine/Penalty
                            </div>
                            <div className='salaryNum mt-1'>
                                {props.data.fineAmount}
                            </div>
                        </div>
                    </div>
                    <div className='salaryDetailWrp grid grid-cols-3 mt-3 gap-4'>
                        <div>
                            <div className='salaryHeader'>
                                Max-Leave
                            </div>
                            <div className='salaryNum mt-1'>
                                {props.data.totalMaxLeave}
                            </div>
                        </div>
                        <div className=''>
                            <div className='salaryHeader'>
                                Leaves
                            </div>
                            <div className='salaryNum mt-1'>
                                {props.data.totalLeave}
                            </div>
                        </div>
                        <div className=''>
                            <div className='salaryHeader'>
                                bonus
                            </div>
                            <div className='salaryNum mt-1'>
                                {props.data.sumOfLeaveSalary}
                            </div>
                        </div>
                    </div>
                    <div className='mt-4 pl-6 pr-4 '>
                        <div className='salaryHeader'>
                            Due Salary
                        </div>
                    </div>
                    <div className='dueSalaryWrp mt-3 ml-6 mr-6'>
                        {props.data.paymentDue}
                    </div>
                    <div className='mt-3 ml-6 mr-6 grid grid-cols-2 gap-6'>
                        <button className='addSalary' onClick={() => props.handleOpen(props.data)}>Give Salary</button>
                        <button className='addLeave' onClick={() => props.handleOpenAddLeave(props.data)}>Add Leave</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EmployeeCard;