import { Tooltip } from '@mui/material';
import './employeeCard.css';
import Menutemp from './menu';
function EmployeeCard(props) {
    const handleEdit = () => {
        props.handleEditClick(props.productData)
    }
    const handleDelete = () => {
        props.handleDeleteProduct(props.productData.productId);
    }
    return (
        <div className='employeeCard'>
            <div className='flex h-full'>
                <div className='imgNameWrp'>
                    <div className='imgWrpCard'>
                        <img src='https://media.istockphoto.com/id/1309328823/photo/headshot-portrait-of-smiling-male-employee-in-office.jpg?b=1&s=612x612&w=0&k=20&c=eU56mZTN4ZXYDJ2SR2DFcQahxEnIl3CiqpP3SOQVbbI=' />
                    </div>
                    <div className='nameAndCategoryWrp'>
                        <Tooltip title={'Vikalp Dipakbhai Chavda'} placement="top-start" arrow>
                            <div className='nameWrp'>
                                Vikalp Dipakbhai Chavda
                            </div>
                        </Tooltip>
                        <Tooltip title={'Panjabi(main)'} placement="top-start" arrow>
                            <div className='categoryWrp'>
                                Panjabi(main)
                            </div>
                        </Tooltip>
                    </div>
                </div>
                <div className='salaryDetailContainer w-full'>
                    <div className='flex editBtnWrp justify-end'>
                        <Menutemp handleDelete={handleDelete} handleEdit={handleEdit} />
                    </div>
                    <div className='salaryDetailWrp grid grid-cols-3 gap-4'>
                        <div>
                            <div className='salaryHeader'>
                                Salary
                            </div>
                            <div className='salaryNum mt-1'>
                                3000000
                            </div>
                        </div>
                        <div>
                            <div className='salaryHeader'>
                                Advanced
                            </div>
                            <div className='salaryNum mt-1'>
                                3000000
                            </div>
                        </div>
                        <div>
                            <div className='salaryHeader'>
                                Fine/Penalty
                            </div>
                            <div className='salaryNum mt-1'>
                                3000000
                            </div>
                        </div>
                    </div>
                    <div className='salaryDetailWrp grid grid-cols-3 mt-3 gap-4'>
                        <div>
                            <div className='salaryHeader'>
                                Max-Leave
                            </div>
                            <div className='salaryNum mt-1'>
                                3
                            </div>
                        </div>
                        <div className='col-span-2'>
                            <div className='salaryHeader'>
                                This Month Leave
                            </div>
                            <div className='salaryNum mt-1'>
                                2
                            </div>
                        </div>
                    </div>
                    <div className='mt-4 pl-6 pr-4 '>
                        <div className='salaryHeader'>
                            Due Salary
                        </div>
                    </div>
                    <div className='dueSalaryWrp mt-3 ml-6 mr-6'>
                        3000000
                    </div>
                    <div className='mt-3 ml-6 mr-6 grid grid-cols-2 gap-6'>
                        <button className='addSalary'>Give Salary</button>
                        <button className='addLeave'>Add Leave</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EmployeeCard;