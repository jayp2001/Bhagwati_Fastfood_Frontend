import './employDetails.css';
import { useState, useEffect } from "react";
import React from "react";
import { BACKEND_BASE_URL } from '../../../url';
import axios from 'axios';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { useParams, useNavigate } from 'react-router-dom';
// import CountCard from '../countCard/countCard';
import CloseIcon from '@mui/icons-material/Close';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import Popover from '@mui/material/Popover';
import Tooltip from '@mui/material/Tooltip';
import { DateRangePicker } from 'react-date-range';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css';
import Box from '@mui/material/Box';
// import ProductQtyCountCard from '../productQtyCard/productQtyCard';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination';
import Paper from '@mui/material/Paper';
// import Menutemp from '../transactionTable/menu';
// import MenuStockInOut from './menu';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function EmployeeDetails() {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    const config = {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userInfo.token}`,
        },
    };
    const [state, setState] = useState([
        {
            startDate: new Date(),
            endDate: new Date(),
            key: 'selection'
        }
    ]);
    const [tab, setTab] = React.useState(1);
    const [filter, setFilter] = React.useState(false);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const ids = open ? 'simple-popover' : undefined;

    const handleClose = () => {
        setAnchorEl(null);
    };
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    return (
        <div className='suppilerListContainer'>
            <div className='grid grid-cols-12 gap-8'>
                <div className='col-span-5 mt-6 grid gap-2 suppilerDetailContainer'>
                    <div className='suppilerHeader'>
                        Suppiler Details
                    </div>
                    <div className='flex gap-6'>
                        <div className='profileImage'>

                        </div>
                        <div className='imgDetailWrp'>
                            <div className='grid grid-cols-12 gap-3 hrLine'>
                                <div className='col-span-6 suppilerDetailFeildHeader'>
                                    Suppluer Name :
                                </div>
                                <div className='col-span-6 suppilerDetailFeild'>
                                    {/* {suppilerDetails.supplierName} */}jay
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='grid grid-cols-12 gap-3 hrLine'>
                        <div className='col-span-5 suppilerDetailFeildHeader'>
                            Suppluer Name :
                        </div>
                        <div className='col-span-7 suppilerDetailFeild'>
                            {/* {suppilerDetails.supplierName} */}
                        </div>
                    </div>
                    <div className='grid grid-cols-12 gap-3 hrLine'>
                        <div className='col-span-5 suppilerDetailFeildHeader'>
                            Nick Name :
                        </div>
                        <div className='col-span-7 suppilerDetailFeild'>
                            {/* {suppilerDetails.nickName} */}
                        </div>
                    </div>
                    <div className='grid grid-cols-12 gap-3 hrLine'>
                        <div className='col-span-5 suppilerDetailFeildHeader'>
                            Firm Name :
                        </div>
                        <div className='col-span-7 suppilerDetailFeild'>
                            {/* {suppilerDetails.firmName} */}
                        </div>
                    </div>
                    <div className='grid grid-cols-12 gap-3 hrLine'>
                        <div className='col-span-5 suppilerDetailFeildHeader'>
                            Address :
                        </div>
                        <div className='col-span-7 suppilerDetailFeild'>
                            {/* {suppilerDetails.firmAddress} */}
                        </div>
                    </div>
                    <div className='grid grid-cols-12 gap-3 hrLine'>
                        <div className='col-span-5 suppilerDetailFeildHeader'>
                            Mobile No :
                        </div>
                        <div className='col-span-7 suppilerDetailFeild'>
                            {/* {suppilerDetails.phoneNumber} */}
                        </div>
                    </div>
                    <div className='grid grid-cols-12 gap-3 '>
                        <div className='col-span-5 suppilerDetailFeildHeader'>
                            Email Id :
                        </div>
                        <div className='col-span-7 suppilerDetailFeild'>
                            {/* {suppilerDetails.emailId} */}
                        </div>
                    </div>
                </div>
                <div className='col-span-7 mt-6'>
                    <div className='datePickerWrp mb-4'>
                        <div className='grid grid-cols-12'>
                            <div className='col-span-12'>
                                <div className='productTableSubContainer'>
                                    <div className='h-full grid grid-cols-12'>
                                        <div className='h-full col-span-5'>
                                            <div className='grid grid-cols-12 pl-6 gap-3 h-full'>
                                                <div className={`flex col-span-6 justify-center ${tab === 1 || tab === '1' || !tab ? 'productTabAll' : 'productTab'}`}
                                                    onClick={() => {
                                                        setTab(1);
                                                    }} >
                                                    <div className='statusTabtext'>Statistics</div>
                                                </div>
                                                <div className={`flex col-span-6 justify-center ${tab === 2 || tab === '2' ? 'productTabIn' : 'productTab'}`}
                                                    onClick={() => {
                                                        setTab(2);
                                                    }}>
                                                    <div className='statusTabtext'>Products</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='col-span-7 flex justify-end pr-4'>
                                            <div className='dateRange text-center self-center' aria-describedby={ids} onClick={handleClick}>
                                                <CalendarMonthIcon className='calIcon' />&nbsp;&nbsp;{(state[0].startDate && filter ? state[0].startDate.toDateString() : 'Select Date')} -- {(state[0].endDate && filter ? state[0].endDate.toDateString() : 'Select Date')}
                                            </div>
                                            <div className='resetBtnWrap col-span-3 self-center'>
                                                <button
                                                    className={`${!filter ? 'reSetBtn' : 'reSetBtnActive'}`}
                                                    onClick={() => {
                                                        setFilter(false);
                                                        setState([
                                                            {
                                                                startDate: new Date(),
                                                                endDate: new Date(),
                                                                key: 'selection'
                                                            }
                                                        ])
                                                        // getProductCount();
                                                        // getStatistics();
                                                        // setTabStockIn(''); setPage(0); setRowsPerPage(5); getStockInDataByTab('')
                                                    }}><CloseIcon /></button>
                                            </div>
                                            <Popover
                                                id={ids}
                                                open={open}
                                                style={{ zIndex: 10000, borderRadius: '10px', boxShadow: 'rgba(0, 0, 0, 0.1) 0rem 0.25rem 0.375rem -0.0625rem, rgba(0, 0, 0, 0.06) 0rem 0.125rem 0.25rem -0.0625rem' }}
                                                anchorEl={anchorEl}
                                                onClose={handleClose}
                                                anchorOrigin={{
                                                    vertical: 'bottom',
                                                    horizontal: 'right',
                                                }}
                                            >
                                                <Box sx={{ bgcolor: 'background.paper', padding: '20px', width: 'auto', height: 'auto', borderRadius: '10px' }}>
                                                    <DateRangePicker
                                                        ranges={state}
                                                        onChange={item => { setState([item.selection]); console.log([item.selection]) }}
                                                        direction="horizontal"
                                                        months={2}
                                                        showSelectionPreview={true}
                                                        moveRangeOnFirstSelection={false}
                                                    />
                                                    <div className='mt-8 grid gap-4 grid-cols-12'>
                                                        <div className='col-span-3 col-start-7'>
                                                            <button className='stockInBtn' onClick={() => {
                                                                // setFilter(true); handleClose(); getStatisticsByFilter(); setTabStockIn(''); setPage(0); setRowsPerPage(5); getStockInDataByTabByFilter(''); getProductCountByFilter();
                                                            }}>Apply</button>
                                                        </div>
                                                        <div className='col-span-3'>
                                                            <button className='stockOutBtn' onClick={handleClose}>cancle</button>
                                                        </div>
                                                    </div>
                                                </Box>
                                            </Popover>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {tab === 1 || tab === '1' ?
                        <div className='grid gap-4 mt-12'>
                            <div className='grid grid-cols-6 gap-6'>
                                <div className='col-span-3'>
                                    {/* <CountCard color={'black'} count={statisticsCount && statisticsCount.totalBusiness ? statisticsCount.totalBusiness : 0} desc={'Total Business'} /> */}
                                </div>
                                <div className='col-span-3'>
                                    {/* <CountCard color={'pink'} count={statisticsCount && statisticsCount.remainingAmount ? statisticsCount.remainingAmount : 0} desc={'Remaining Payment'} /> */}
                                </div>
                            </div>
                            <div className='grid grid-cols-6 gap-6'>
                                <div className='col-span-3'>
                                    {/* <CountCard color={'blue'} count={statisticsCount && statisticsCount.totalBusinessOfDebit ? statisticsCount.totalBusinessOfDebit : 0} desc={'Total Debit'} /> */}
                                </div>
                                <div className='col-span-3'>
                                    {/* <CountCard color={'orange'} count={statisticsCount && statisticsCount.totalPaid ? statisticsCount.totalPaid : 0} desc={'Paid'} /> */}
                                </div>
                            </div>
                            <div className='grid grid-cols-6 gap-6'>
                                <div className='col-span-3'>
                                    {/* <CountCard color={'green'} count={statisticsCount && statisticsCount.totalBusinessOfCash ? statisticsCount.totalBusinessOfCash : 0} desc={'Total Cash'} /> */}
                                </div>
                                <div className='col-span-3'>
                                    {/* <CountCard color={'yellow'} count={statisticsCount && statisticsCount.totalProduct ? statisticsCount.totalProduct : 0} desc={'Total Product'} /> */}
                                </div>
                            </div>
                        </div> :
                        <div className='grid gap-4 mt-12' style={{ maxHeight: '332px', overflowY: 'scroll' }}>
                            <div className='grid grid-cols-2 gap-6 pb-3'>
                                {/* {
                                    productQtyCount && productQtyCount?.map((row, index) => (
                                        <ProductQtyCountCard productQtyUnit={row.productUnit} productQty={row.productQuantity} productName={row.productName} index={index} />
                                    ))
                                } */}
                            </div>
                        </div>
                    }
                </div>
            </div>
        </div>
    )
}

export default EmployeeDetails;