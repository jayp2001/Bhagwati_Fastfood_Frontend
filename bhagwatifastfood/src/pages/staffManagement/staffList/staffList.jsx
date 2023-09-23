import './staffList.css';
import CountCard from '../../inventory/countCard/countCard'
import EmployeeCard from '../employeeCard/employeeCard';
import { useState, useEffect } from "react";
import React from "react";
import { useRef } from 'react';
import { BACKEND_BASE_URL } from '../../../url';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import Typography from '@mui/material/Typography';
import dayjs from 'dayjs';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { useNavigate } from "react-router-dom";

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
function StaffList() {
    const [category, setCategory] = useState('');
    const [isInActive, setIsInActive] = useState('');
    const [open, setOpen] = React.useState(false);
    const [openAddLeave, setOpenAddLeave] = React.useState(false);
    const [activeCategory, setActiveCategory] = useState('');
    const [employeeList, setEmployeeList] = useState('');
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    const config = {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userInfo.token}`,
        },
    };
    const navigate = useNavigate();
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(false);
    const [success, setSuccess] = React.useState(false);
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
    const handleClose = () => {
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
        setIsInActive(false)
        setOpen(false);
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
        setOpen(true);
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
    const deleteData = async (id) => {
        await axios.delete(`${BACKEND_BASE_URL}inventoryrouter/removeSupplierDetails?supplierId=${id}`, config)
            .then((res) => {
                // getData();
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const handleDeleteEmployee = (id) => {
        if (window.prompt("Are you sure you want to delete Employee?") == 1234) {
            // deleteData(id);
            alert('heyy')
        }
    }
    const addPayment = async () => {
        setLoading(true);
        await axios.post(`${BACKEND_BASE_URL}staffrouter/addAmountOfSFA`, formData, config)
            .then((res) => {
                setLoading(false);
                setSuccess(true);
                handleClose();
                setTimeout(() => {
                    getEmployeeList(activeCategory);
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
                getEmployeeList(activeCategory);
            })
            .catch((error) => {
                setLoading(false);
                setError(error.response && error.response.data ? error.response.data : "Network Error ...!!!");
            })
    }
    const handleOpenInactive = async (row, index) => {
        await axios.get(`${BACKEND_BASE_URL}staffrouter/getMidMonthInActiveSalaryOfEmployee?employeeId=${row.employeeId}`, config)
            .then((res) => {
                setFormData((perv) => ({
                    ...perv,
                    employeeId: row.employeeId,
                    nickName: row.nickName,
                    paymentDue: row.paymentDue,
                    totalSalary: row.totalSalary + res.data.proratedSalary,
                    advanceAmount: row.advanceAmount,
                    fineAmount: row.fineAmount,
                    paymentDue: row.paymentDue,
                    proratedSalary: res.data.proratedSalary
                }))
                setOpen(true);
            })
            .catch((error) => {
                setLoading(false);
                setError(error.response && error.response.data ? error.response.data : "Network Error ...!!!");
            })
    }
    const handleActiveInactive = (row, index) => {
        // alert("Jay")
        let employeeData = employeeList;
        if (employeeData[index].employeeStatus) {
            setIsInActive(true);
            employeeData[index].employeeStatus = false
            setEmployeeList(employeeData);
            console.log('inactiveAfter', employeeList[index])
        }
        else {
            employeeData[index].employeeStatus = true
            setEmployeeList(employeeData);
            console.log('activeAfter', employeeList[index])
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
    const handleEditEmployee = (id) => {
        navigate(`/staff/editStaff/${id}`)
    }
    const getCategory = async () => {
        await axios.get(`${BACKEND_BASE_URL}staffrouter/getStaffCategoryWithEmployeeNumber`, config)
            .then((res) => {
                setCategory(res.data);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }

    const getEmployeeList = async (tab) => {
        await axios.get(`${BACKEND_BASE_URL}staffrouter/getEmployeeData?categoryId=${tab}`, config)
            .then((res) => {
                setEmployeeList(res.data);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    if (loading) {
        console.log('>>>>??')
        toast.loading("Please wait...", {
            toastId: 'loading'
        })
    }
    if (success) {
        toast.dismiss('loading');
        toast('success',
            {
                type: 'success',
                toastId: 'success',
                position: "bottom-right",
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
            setLoading(false)
            setSuccess(false)
        }, 50)
    }
    if (error) {
        toast.dismiss('loading');
        toast(error, {
            type: 'error',
            position: "bottom-right",
            toastId: 'error',
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
        });
        setLoading(false)
        setError(false);
    }

    useEffect(() => {
        console.log('>>>LLL')
        getEmployeeList('');
        getCategory();
    }, [])
    if (!employeeList) {
        return null;
    }
    return (
        <div className='mainBody flex gap-4 pr-4 pl-4'>
            <div className='categoryListContainer'>
                <div className='categoryHeader'>
                    Categories
                    <hr className="hr"></hr>
                </div>
                <div className='categoryListWrp'>
                    <div className={activeCategory === '' ? 'active' : 'navLink'} onClick={() => { setActiveCategory(''); getEmployeeList('') }}>
                        All
                    </div>
                    {
                        category ? category.map((data, index) => (
                            <div key={data.staffCategoryId} className={activeCategory === data.staffCategoryId ? 'active' : 'navLink'} onClick={() => { setActiveCategory(data.staffCategoryId); getEmployeeList(data.staffCategoryId) }}>
                                {data.staffCategoryName}
                            </div>
                        )) : <></>
                    }
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
                        {
                            employeeList ? employeeList.map((employeeData, index) => (
                                <EmployeeCard handleActiveInactive={handleActiveInactive} formDataErrorFeild={formDataErrorFeild} getEmployeeList={getEmployeeList} setLoading={setLoading} loading={loading} activeCategory={activeCategory} setSuccess={setSuccess} success={success} handleClose={handleClose} formData={formData} formDataError={formDataError} setFormDataError={setFormDataError} onChange={onChange} setFormData={setFormData} switch={employeeData.employeeStatus} setOpen={setOpen} setError={setError} index={index} data={employeeData} handleOpen={handleOpen} handleOpenAddLeave={handleOpenAddLeave} handleDeleteEmployee={handleDeleteEmployee} handleEditEmployee={handleEditEmployee} />
                            ))
                                :
                                <div className='grid mt-24 col-span-5 content-center'>
                                    <div className='text-center noDataFoundText'>
                                        {error ? error : 'No Data Found'}
                                    </div>
                                </div>
                        }
                    </div>
                </div>
            </div>
            <Modal
                open={open}
                onClose={handleClose}
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
                                    <MenuItem key={4} value={4}>{"Credit Advance"}</MenuItem>
                                    <MenuItem key={5} value={5}>{"Credit Fine"}</MenuItem>
                                    <MenuItem key={6} value={6}>{"Bonus"}</MenuItem>
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
                                handleClose();
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
        </div >
    )
}

export default StaffList;