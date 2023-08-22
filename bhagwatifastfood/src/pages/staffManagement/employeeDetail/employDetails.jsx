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
import Switch from '@mui/material/Switch';
import { ToastContainer, toast } from 'react-toastify';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import dayjs from 'dayjs';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import 'react-toastify/dist/ReactToastify.css';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
const styleStockIn = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 900,
    bgcolor: 'background.paper',
    boxShadow: 24,
    paddingLeft: '20px',
    paddingRight: '20px',
    paddingTop: '15px',
    paddingBottom: '20px',
    borderRadius: '10px'
};
function EmployeeDetails() {
    let { id } = useParams();
    const [loading, setLoading] = React.useState(false);
    const [tabTable, setTabTable] = React.useState(1);
    const [error, setError] = React.useState(false);
    const [success, setSuccess] = React.useState(false);
    const [openAddLeave, setOpenAddLeave] = React.useState(false);
    const [openModal, setOpenModal] = React.useState(false);
    const [data, setData] = useState();
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    const [toggel, setToggel] = useState(false);
    const label = { inputProps: { 'aria-label': 'Size switch demo' } };
    const [addLeaveFormData, setAddLeaveFormData] = React.useState({
        employeeId: '',
        numLeave: '',
        leaveReason: '',
        leaveDate: dayjs(),
    });
    const [addLeaveFormDataError, setAddLeaveFormDataError] = React.useState({
        numLeave: false,
        leaveReason: false,
        leaveDate: false
    });
    const [addLeaveFormDataErrorFeild, setAddLeaveFormDataErrorFeild] = React.useState([
        'numLeave',
        'leaveReason',
        'leaveDate',
    ]);

    const [formData, setFormData] = React.useState({
        employeeId: '',
        payAmount: '',
        amountType: 1,
        comment: '',
        amountDate: dayjs(),
    });
    const [formDataError, setFormDataError] = React.useState({
        payAmount: false,
        amountType: false,
        amountDate: false,
    });
    const [formDataErrorFeild, setFormDataErrorFeild] = React.useState([
        'payAmount',
        'amountType',
        'amountDate',
    ]);

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
    const getData = async () => {
        await axios.get(`${BACKEND_BASE_URL}staffrouter/getEmployeeDetailsById?employeeId=${id}`, config)
            .then((res) => {
                setToggel(res.data.employeeStatus == 1 ? true : false)
                setData(res.data);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const handlePaymentData = (date) => {
        setFormData((prevState) => ({
            ...prevState,
            ["amountDate"]: date && date['$d'] ? date['$d'] : null,
        }))
    };
    const handleLeaveDate = (date) => {
        setFormData((prevState) => ({
            ...prevState,
            ["leaveDate"]: date && date['$d'] ? date['$d'] : null,
        }))
    };
    const onChange = (e) => {

        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }))

    }
    const onChangeLeave = (e) => {
        setAddLeaveFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }))
    }
    const addPayment = async () => {
        setLoading(true);
        await axios.post(`${BACKEND_BASE_URL}staffrouter/addAmountOfSFA`, formData, config)
            .then((res) => {
                setLoading(false);
                setSuccess(true);
                handleClose();
                setTimeout(() => {
                    // getEmployeeList(activeCategory);
                }, 50)

            })
            .catch((error) => {
                setLoading(false);
                setError(error.response && error.response.data ? error.response.data : "Network Error ...!!!");
            })
    }
    const addLeave = async () => {
        setLoading(true);
        await axios.post(`${BACKEND_BASE_URL}staffrouter/addEmployeeLeave`, addLeaveFormData, config)
            .then((res) => {
                setLoading(false);
                setSuccess(true);
                handleCloseAddLeave();
                // getEmployeeList(activeCategory);
            })
            .catch((error) => {
                setLoading(false);
                setError(error.response && error.response.data ? error.response.data : "Network Error ...!!!");
            })
    }
    const handleCloseModel = () => {
        setFormData({
            employeeId: '',
            payAmount: '',
            amountType: 1,
            comment: '',
            amountDate: dayjs(),
        })
        setFormDataError({
            payAmount: false,
            amountType: false,
            amountDate: false,
        })
        // setIsInActive(false)
        setOpenModal(false);
    }
    const handleOpen = (row) => {
        setFormData((perv) => ({
            ...perv,
            employeeId: row.employeeId,
            nickName: row.nickName,
            paymentDue: row.paymentDue,
            totalSalary: row.totalSalary,
            advanceAmount: row.advanceAmount,
            fineAmount: row.fineAmount,
            paymentDue: row.paymentDue,
            dateOfPayment: row.dateOfPayment
        }))
        setOpenModal(true);
    }
    const handleToggel = async () => {
        let data = formData;
        console.log('statsusss', toggel)
        // props.handleActiveInactive(props.data, props.index)
        if (toggel) {
            // setToggel(false)
            handleOpenInactive()
        } else {
            data = {
                employeeId: data.employeeId,
                employeeStatus: true,
                payStatus: false
            }
            setLoading(true);
            await axios.post(`${BACKEND_BASE_URL}staffrouter/updateEmployeeStatus`, data, config)
                .then((res) => {
                    setLoading(false);
                    setSuccess(true);
                    setOpenModal(false)
                    setToggel(true)
                    handleClose();
                })
                .catch((error) => {
                    setLoading(false);
                    setError(error.response && error.response.data ? error.response.data : "Network Error ...!!!");
                })
        }
    }
    const submitLeave = () => {
        if (loading || success) {

        } else {
            const isValidate = addLeaveFormDataErrorFeild.filter(element => {
                if (addLeaveFormDataError[element] === true || addLeaveFormData[element] === '') {
                    setAddLeaveFormDataError((perv) => ({
                        ...perv,
                        [element]: true
                    }))
                    return element;
                }
            })
            console.log('????', isValidate);
            if (isValidate.length > 0) {
                setError(
                    "Please Fill All Field"
                )
            } else {
                addLeave()
            }
        }
    }
    const submit = () => {
        if (loading || success) {

        } else {
            const isValidate = formDataErrorFeild.filter(element => {
                if (formDataError[element] === true || formData[element] === '') {
                    setFormDataError((perv) => ({
                        ...perv,
                        [element]: true
                    }))
                    return element;
                }
            })
            console.log('????', isValidate);
            if (isValidate.length > 0) {
                setError(
                    "Please Fill All Field"
                )
            } else {
                addPayment()
            }
        }
    }
    const handleCloseAddLeave = () => {
        setAddLeaveFormData({
            employeeId: '',
            numLeave: '',
            leaveReason: '',
            leaveDate: dayjs(),
        })
        setAddLeaveFormDataError({
            payAmount: false,
            amountType: false,
            amountDate: false,
        })
        setOpenAddLeave(false);
    }
    const handleOpenAddLeave = (row) => {
        setAddLeaveFormData((perv) => ({
            ...perv,
            employeeId: row.employeeId,
            availableLeave: row.totalMaxLeave - row.totalLeave,
            totalMaxLeave: row.totalMaxLeave,
            nickName: row.nickName,
        }))
        setOpenAddLeave(true);
    }
    const handleOpenInactive = async () => {
        await axios.get(`${BACKEND_BASE_URL}staffrouter/getMidMonthInActiveSalaryOfEmployee?employeeId=${data.employeeId}`, config)
            .then((res) => {
                setFormData((perv) => ({
                    ...perv,
                    employeeId: data.employeeId,
                    nickName: data.nickName,
                    paymentDue: data.paymentDue,
                    totalSalary: data.totalSalary + res.data.proratedSalary,
                    advanceAmount: data.advanceAmount,
                    fineAmount: data.fineAmount,
                    paymentDue: data.paymentDue,
                    proratedSalary: data.proratedSalary,
                    dateOfPayment: data.dateOfPayment
                }))
                setOpenModal(true);
            })
            .catch((error) => {
                setLoading(false);
                setError(error.response && error.response.data ? error.response.data : "Network Error ...!!!");
            })
    }
    useEffect(() => {
        getData();
    }, [])
    if (loading) {
        console.log('>>>>??')
        toast.loading("Please wait...", {
            toastId: 'loading'
        })
    }
    if (success) {
        // setLoading(false);
        toast.dismiss('loading');
        toast('success',
            {
                type: 'success',
                toastId: 'success',
                position: "top-right",
                toastId: 'error',
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
            });
        setTimeout(() => {
            setSuccess(false);
            setLoading(false);
        }, 50)
    }
    if (error) {
        setLoading(false);
        toast.dismiss('loading');
        toast(error, {
            type: 'error',
            position: "top-right",
            toastId: 'error',
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
        });
        setError(false);
    }
    if (!data) {
        return null;
    }
    return (
        <div className='suppilerListContainer'>
            <div className='grid grid-cols-12 gap-8'>
                <div className='col-span-12 '>
                    <div className='datePickerWrp mb-4'>
                        <div className='grid grid-cols-12'>
                            <div className='col-span-12'>
                                <div className='productTableSubContainer'>
                                    <div className='h-full grid grid-cols-12'>
                                        <div className='h-full col-span-8'>
                                            <div className='grid grid-cols-12 pl-6 gap-3 h-full'>
                                                <div className={`flex col-span-3 justify-center ${tab === 1 || tab === '1' || !tab ? 'productTabAll' : 'productTab'}`}
                                                    onClick={() => {
                                                        setTab(1);
                                                    }} >
                                                    <div className='statusTabtext'>Employee Detail</div>
                                                </div>
                                                <div className={`flex col-span-3 justify-center ${tab === 2 || tab === '2' ? 'productTabIn' : 'productTab'}`}
                                                    onClick={() => {
                                                        setTab(2);
                                                    }}>
                                                    <div className='statusTabtext'>Statistics</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='col-span-4 flex justify-end pr-4'>
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
                                                        // setTabTable(''); setPage(0); setRowsPerPage(5); getStockInDataByTab('')
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
                                                                // setFilter(true); handleClose(); getStatisticsByFilter(); setTabTable(''); setPage(0); setRowsPerPage(5); getStockInDataByTabByFilter(''); getProductCountByFilter();
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
                        <div className='detailCard'>
                            <div className='grid grid-cols-12 gap-6 pr-4'>
                                <div className='imgNameWrp col-span-4 grid'>
                                    <div className='imgWrpCardDetail justify-self-center mt-3'>
                                        <img src={"http://192.168.1.206:8000/staffrouter/getImagebyName?imageName=Vikalp_1690966625522.jpg"} />
                                    </div>
                                    <div className='flex editBtnWrp justify-center mt-4'>
                                        <div>
                                            <Switch
                                                {...label}
                                                defaultChecked
                                                checked={toggel}
                                                onChange={() => handleToggel()}
                                            />
                                        </div>
                                    </div>
                                    <div className='nameAndCategoryWrp'>
                                        <Tooltip title={data.employeeName} placement="top" arrow>
                                            <div className='nameWrpDetail'>
                                                {data.employeeName}
                                            </div>
                                        </Tooltip>
                                        <Tooltip title={data.category} placement="top" arrow>
                                            <div className='categoryWrpDetail'>
                                                {data.category}
                                            </div>
                                        </Tooltip>
                                    </div>
                                    <div className='mt-8 ml-6 mr-6 grid grid-cols-2 gap-6'>
                                        <button className='addSalary' onClick={() => handleOpen(data)}>Give Salary</button>
                                        <button className='addLeave' onClick={() => handleOpenAddLeave(data)}>Add Leave</button>
                                    </div>
                                </div>
                                <div className='mt-3 col-span-4 detailContainer'>
                                    <div className='grid grid-cols-12 gap-3 hrLine'>
                                        <div className='col-span-5 suppilerDetailFeildHeader'>
                                            Nick Name :
                                        </div>
                                        <div className='col-span-7 suppilerDetailFeild'>
                                            {data.employeeNickName}
                                        </div>
                                    </div>
                                    <div className='grid grid-cols-12 gap-3 hrLine'>
                                        <div className='col-span-5 suppilerDetailFeildHeader'>
                                            Gender :
                                        </div>
                                        <div className='col-span-7 suppilerDetailFeild'>
                                            {data.employeeGender}
                                        </div>
                                    </div>
                                    <div className='grid grid-cols-12 gap-3 hrLine'>
                                        <div className='col-span-5 suppilerDetailFeildHeader'>
                                            Mobile Number :
                                        </div>
                                        <div className='col-span-7 suppilerDetailFeild'>
                                            {data.employeeMobileNumber}
                                        </div>
                                    </div>
                                    <div className='grid grid-cols-12 gap-3 hrLine'>
                                        <div className='col-span-5 suppilerDetailFeildHeader'>
                                            Other Number :
                                        </div>
                                        <div className='col-span-7 suppilerDetailFeild'>
                                            {data.employeeOtherMobileNumber}
                                        </div>
                                    </div>
                                    <div className='grid grid-cols-12 gap-3 hrLine'>
                                        <div className='col-span-5 suppilerDetailFeildHeader'>
                                            Present Address :
                                        </div>
                                        <div className='col-span-7 suppilerDetailFeild'>
                                            {data.presentAddress}
                                        </div>
                                    </div>
                                    <div className='grid grid-cols-12 gap-3 hrLine'>
                                        <div className='col-span-5 suppilerDetailFeildHeader'>
                                            Home Address:
                                        </div>
                                        <div className='col-span-7 suppilerDetailFeild'>
                                            {data.homeAddress}
                                        </div>
                                    </div>
                                    <div className='grid grid-cols-12 gap-3 hrLine'>
                                        <div className='col-span-5 suppilerDetailFeildHeader'>
                                            Adharcard Number:
                                        </div>
                                        <div className='col-span-7 suppilerDetailFeild'>
                                            {data.adharCardNum}
                                        </div>
                                    </div>
                                    <div className='grid grid-cols-12 gap-3 hrLine'>
                                        <div className='col-span-5 suppilerDetailFeildHeader'>
                                            Home Address:
                                        </div>
                                        <div className='col-span-7 suppilerDetailFeild'>
                                            {data.homeAddress}
                                        </div>
                                    </div>
                                    <div className='grid grid-cols-12 gap-3'>
                                        <div className='col-span-5 suppilerDetailFeildHeader'>
                                            Category:
                                        </div>
                                        <div className='col-span-7 suppilerDetailFeild'>
                                            {data.category}
                                        </div>
                                    </div>
                                </div>
                                <div className='mt-3 col-span-4 detailContainer'>
                                    <div className='grid grid-cols-12 gap-3 hrLine'>
                                        <div className='col-span-5 suppilerDetailFeildHeader'>
                                            Current Salary :
                                        </div>
                                        <div className='col-span-7 suppilerDetailFeild'>
                                            {data.salary}
                                        </div>
                                    </div>
                                    <div className='grid grid-cols-12 gap-3 hrLine'>
                                        <div className='col-span-5 suppilerDetailFeildHeader'>
                                            Max Leave :
                                        </div>
                                        <div className='col-span-7 suppilerDetailFeild'>
                                            {data.maxLeave}
                                        </div>
                                    </div>
                                    <div className='grid grid-cols-12 gap-3 hrLine'>
                                        <div className='col-span-5 suppilerDetailFeildHeader'>
                                            Employee Joining :
                                        </div>
                                        <div className='col-span-7 suppilerDetailFeild'>
                                            {data.employeeJoiningDate}
                                        </div>
                                    </div>
                                    <div className='grid grid-cols-12 gap-3 hrLine'>
                                        <div className='col-span-5 suppilerDetailFeildHeader'>
                                            Last Payment Date :
                                        </div>
                                        <div className='col-span-7 suppilerDetailFeild'>
                                            {data.employeeLastPaymentDate}
                                        </div>
                                    </div>
                                    <div className='grid grid-cols-12 gap-3 hrLine'>
                                        <div className='col-span-5 suppilerDetailFeildHeader'>
                                            Account Holder :
                                        </div>
                                        <div className='col-span-7 suppilerDetailFeild'>
                                            {data.accountHolderName}
                                        </div>
                                    </div>
                                    <div className='grid grid-cols-12 gap-3 hrLine'>
                                        <div className='col-span-5 suppilerDetailFeildHeader'>
                                            Account Number:
                                        </div>
                                        <div className='col-span-7 suppilerDetailFeild'>
                                            {data.accountNumber}
                                        </div>
                                    </div>
                                    <div className='grid grid-cols-12 gap-3 hrLine'>
                                        <div className='col-span-5 suppilerDetailFeildHeader'>
                                            IFSC Code:
                                        </div>
                                        <div className='col-span-7 suppilerDetailFeild'>
                                            {data.ifscCode}
                                        </div>
                                    </div>
                                    <div className='grid grid-cols-12 gap-3 hrLine'>
                                        <div className='col-span-5 suppilerDetailFeildHeader'>
                                            Bank Name:
                                        </div>
                                        <div className='col-span-7 suppilerDetailFeild'>
                                            {data.bankName}
                                        </div>
                                    </div>
                                    <div className='grid grid-cols-12 gap-3'>
                                        <div className='col-span-5 suppilerDetailFeildHeader'>
                                            Branch Name:
                                        </div>
                                        <div className='col-span-7 suppilerDetailFeild'>
                                            {data.branchName}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        :
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
            <div className='grid grid-cols-12 mt-6'>
                <div className='col-span-12'>
                    <div className='productTableSubContainer'>
                        <div className='h-full grid grid-cols-12'>
                            <div className='h-full col-span-12'>
                                <div className='grid grid-cols-12 pl-6 gap-3 h-full'>
                                    <div className={`flex col-span-2 justify-center ${tabTable === 1 || tabTable === '1' ? 'productTabAll' : 'productTab'}`} onClick={() => {
                                        setTabTable(1);
                                        // setPage(0); setRowsPerPage(5); filter ? getStockInDataByTabByFilter('') : getStockInDataByTab('');
                                    }}>
                                        <div className='statusTabtext'>In-Stock</div>
                                    </div>
                                    <div className={`flex col-span-2 justify-center ${tabTable === 'debit' ? 'tabDebit' : 'productTab'}`} onClick={() => {
                                        setTabTable('debit');
                                        // setPage(0); filter ? getStockInDataByTabByFilter('debit') : getStockInDataByTab('debit'); setRowsPerPage(5);
                                    }}>
                                        <div className='statusTabtext'>Debit</div>
                                    </div>
                                    <div className={`flex col-span-2 justify-center ${tabTable === 'cash' ? 'tabCash' : 'productTab'}`} onClick={() => {
                                        setTabTable('cash');
                                        // setPage(0); filter ? getStockInDataByTabByFilter('cash') : getStockInDataByTab('cash'); setRowsPerPage(5);
                                    }}>
                                        <div className='statusTabtext'>Cash</div>
                                    </div>
                                    <div className={`flex col-span-3 justify-center ${tabTable === 'transaction' ? 'tabTransaction' : 'productTab'}`} onClick={() => {
                                        setTabTable('transaction');
                                        // setPage(0); filter ? getDebitDataByFilter() : getDebitDataByTab(); setRowsPerPage(5);
                                    }}>
                                        <div className='statusTabtext'>Transactions</div>
                                    </div>
                                    <div className={`flex col-span-2 justify-center ${tabTable === 'products' ? 'products' : 'productTab'}`} onClick={() => {
                                        setTabTable('products');
                                        // setPage(0); filter ? getProductDataByFilter() : getProductDataByTab(); setRowsPerPage(5);
                                    }}>
                                        <div className='statusTabtext'>Products</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Modal
                open={openModal}
                onClose={handleCloseModel}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={styleStockIn}>
                    <div className='flex justify-between'>
                        <Typography id="modal-modal" variant="h6" component="h2">
                            <span className='makePaymentHeader'>Make Payment to : </span><span className='makePaymentName'>{formData.nickName}</span>
                        </Typography>
                        <Typography id="modal-modal" variant="h6" component="h2">
                            <span className='makePaymentHeader'>{'Payment Due :'}&nbsp;&nbsp;&nbsp;&nbsp;</span><span className='makePaymentName'>{formData.totalSalary}</span>
                        </Typography>
                    </div>
                    <div className='flex justify-between mt-3 mb-2'>
                        <Typography id="modal-modal" variant="h6" component="h2">
                            <span className='makePaymentHeader'>{'Salary (From - To) :'} </span><span className='makePaymentName'>{formData.dateOfPayment}</span>
                        </Typography>
                        <Typography id="modal-modal" variant="h6" component="h2">
                            <span className='makePaymentHeader'>{'Total Salary(With Leave) :'}&nbsp;&nbsp;&nbsp;&nbsp;</span><span className='makePaymentName'>{formData.totalSalary}</span>
                        </Typography>
                    </div>
                    <div className='mt-6 grid grid-cols-12 gap-6'>
                        <div className='col-span-4'>
                            <TextField
                                onBlur={(e) => {
                                    if (e.target.value < 0) {
                                        setFormDataError((perv) => ({
                                            ...perv,
                                            payAmount: true
                                        }))
                                    }
                                    else {
                                        setFormDataError((perv) => ({
                                            ...perv,
                                            payAmount: false
                                        }))
                                    }
                                }}
                                type="number"
                                label="Paid Amount"
                                fullWidth
                                onChange={onChange}
                                value={formData.payAmount}
                                error={formDataError.payAmount}
                                // helperText={formData.supplierName && !formDataError.productQty ? `Remain Payment  ${formData.remainingAmount}` : formDataError.paidAmount ? formData.paidAmount > formData.remainingAmount ? `Payment Amount can't be more than ${formData.remainingAmount}` : "Please Enter Amount" : ''}
                                // helperText={formData.amountType == 1 ? formData.payAmount ? formData.payAmount > formData.totalSalary ? `Amount can't be more than ${formData.totalSalary}` : `Remaining Payment ${formData.paymentDue}` : formDataError.totalSalary ? "Please Enter Amount" : `Remaining Payment ${formData.paymentDue}` : ''}
                                name="payAmount"
                                InputProps={{
                                    startAdornment: <InputAdornment position="start"><CurrencyRupeeIcon /></InputAdornment>,
                                }}
                            />
                        </div>
                        <div className="col-span-4">
                            <FormControl style={{ minWidth: '100%' }}>
                                <InputLabel id="demo-simple-select-label" required error={formDataError.amountType}>Payment Type</InputLabel>
                                <Select
                                    onBlur={(e) => {
                                        if (!e.target.value) {
                                            setFormDataError((perv) => ({
                                                ...perv,
                                                amountType: true
                                            }))
                                        }
                                        else {
                                            setFormDataError((perv) => ({
                                                ...perv,
                                                amountType: false
                                            }))
                                        }
                                    }}
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={formData.amountType}
                                    error={formDataError.amountType}
                                    name="amountType"
                                    label="Payment Type"
                                    onChange={onChange}
                                >
                                    <MenuItem key={1} value={1}>{"Salary"}</MenuItem>
                                    <MenuItem key={2} value={2}>{"Advanced"}</MenuItem>
                                    <MenuItem key={3} value={3}>{"Fine"}</MenuItem>
                                </Select>
                            </FormControl>
                        </div>
                        <div className='col-span-4'>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DesktopDatePicker
                                    textFieldStyle={{ width: '100%' }}
                                    InputProps={{ style: { fontSize: 14, width: '100%' } }}
                                    InputLabelProps={{ style: { fontSize: 14 } }}
                                    label="Payment Date"
                                    format="DD/MM/YYYY"
                                    required
                                    error={formDataError.amountDate}
                                    value={dayjs(formData.amountDate)}
                                    onChange={handlePaymentData}
                                    name="amountDate"
                                    renderInput={(params) => <TextField {...params} sx={{ width: '100%' }} />}
                                />
                            </LocalizationProvider>
                        </div>
                    </div>
                    <div className='mt-4 grid grid-cols-12 gap-6'>
                        <div className='col-span-12'>
                            <TextField
                                disabled={formData.remainingAmount == 0}
                                onChange={onChange}
                                value={formData.comment}
                                name="comment"
                                id="outlined-required"
                                label="Comment"
                                InputProps={{ style: { fontSize: 14 } }}
                                InputLabelProps={{ style: { fontSize: 14 } }}
                                fullWidth
                            />
                        </div>
                    </div>
                    <div className='mt-4 grid grid-cols-12 gap-6'>
                        <div className='col-span-3 col-start-7'>
                            <button className='addCategorySaveBtn' onClick={() => {
                                submit();
                            }}>Make Payment</button>
                        </div>
                        <div className='col-span-3'>
                            <button className='addCategoryCancleBtn' onClick={() => {
                                handleCloseModel();
                            }}>Cancle</button>
                        </div>
                    </div>
                </Box>
            </Modal>
            <Modal
                open={openAddLeave}
                onClose={handleCloseAddLeave}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={styleStockIn}>
                    <div className='flex justify-between'>
                        <Typography id="modal-modal" variant="h6" component="h2">
                            <span className='makePaymentHeader'> Add Leave for : </span><span className='makePaymentName'>{addLeaveFormData.nickName}</span>
                        </Typography>
                        <Typography id="modal-modal" variant="h6" component="h2">
                            <span className='makePaymentHeader'>{`Available Leave(${'Max leave:' + addLeaveFormData.totalMaxLeave}) :`}&nbsp;&nbsp;&nbsp;&nbsp;</span><span className='makePaymentName'>{addLeaveFormData.availableLeave}</span>
                        </Typography>
                    </div>
                    <div className='mt-6 grid grid-cols-12 gap-6'>
                        <div className='col-span-6'>
                            <TextField
                                onBlur={(e) => {
                                    if (e.target.value < 0) {
                                        setAddLeaveFormDataError((perv) => ({
                                            ...perv,
                                            numLeave: true
                                        }))
                                    }
                                    else {
                                        setAddLeaveFormDataError((perv) => ({
                                            ...perv,
                                            numLeave: false
                                        }))
                                    }
                                }}
                                type="number"
                                label="Add Leave"
                                fullWidth
                                onChange={onChangeLeave}
                                value={addLeaveFormData.numLeave}
                                error={addLeaveFormDataError.numLeave}
                                helperText={addLeaveFormDataError.numLeave ? 'Please enter leave' : ''}
                                name="numLeave"
                            />
                        </div>
                        <div className='col-span-6'>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DesktopDatePicker
                                    textFieldStyle={{ width: '100%' }}
                                    InputProps={{ style: { fontSize: 14, width: '100%' } }}
                                    InputLabelProps={{ style: { fontSize: 14 } }}
                                    label="Leave Date"
                                    format="DD/MM/YYYY"
                                    required
                                    error={addLeaveFormDataError.leaveDate}
                                    value={dayjs(addLeaveFormData.leaveDate)}
                                    onChange={handleLeaveDate}
                                    name="leaveDate"
                                    renderInput={(params) => <TextField {...params} sx={{ width: '100%' }} />}
                                />
                            </LocalizationProvider>
                        </div>
                    </div>
                    <div className='mt-4 grid grid-cols-12 gap-6'>
                        <div className='col-span-12'>
                            <TextField
                                onBlur={(e) => {
                                    if (e.target.value < 4) {
                                        setAddLeaveFormDataError((perv) => ({
                                            ...perv,
                                            leaveReason: true
                                        }))
                                    }
                                    else {
                                        setAddLeaveFormDataError((perv) => ({
                                            ...perv,
                                            leaveReason: false
                                        }))
                                    }
                                }}
                                onChange={onChangeLeave}
                                value={formData.leaveReason}
                                name="leaveReason"
                                id="outlined-required"
                                label="Reason"
                                InputProps={{ style: { fontSize: 14 } }}
                                InputLabelProps={{ style: { fontSize: 14 } }}
                                error={addLeaveFormDataError.leaveReason}
                                helperText={addLeaveFormDataError.leaveReason ? 'Please enter Reason' : ''}
                                fullWidth
                            />
                        </div>
                    </div>
                    <div className='mt-4 grid grid-cols-12 gap-6'>
                        <div className='col-span-3 col-start-7'>
                            <button className='addCategorySaveBtn' onClick={() => {
                                submitLeave()
                            }}>Add Leave</button>
                        </div>
                        <div className='col-span-3'>
                            <button className='addCategoryCancleBtn' onClick={() => {
                                handleCloseAddLeave();
                            }}>Cancle</button>
                        </div>
                    </div>
                </Box>
            </Modal>
            <ToastContainer />
        </div>
    )
}

export default EmployeeDetails;