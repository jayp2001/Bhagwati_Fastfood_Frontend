import ConsoleCard from "./component/consoleCard/consoleCard";
import './dashboard.css';
import React, { useRef } from 'react';
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useLocation, Navigate, Outlet } from "react-router-dom";
import TextField from '@mui/material/TextField';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { ToastContainer, toast } from 'react-toastify';
import jwt_decode from 'jwt-decode'
import CryptoJS from 'crypto-js';
import Autocomplete from '@mui/material/Autocomplete';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import Table from '@mui/material/Table';
import Box from '@mui/material/Box';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination';
import Paper from '@mui/material/Paper';
import Tooltip from '@mui/material/Tooltip';
import CategoryCard from "../categoryCard/categoryCard";
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css';
import { DateRangePicker } from 'react-date-range';
import Popover from '@mui/material/Popover';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    bgcolor: 'background.paper',
    boxShadow: 24,
    paddingLeft: '20px',
    paddingRight: '20px',
    paddingTop: '15px',
    paddingBottom: '20px',
    borderRadius: '10px'
};
function ExpenseDashboard() {
    const regex = /^[0-9\b]+$/;
    const emailRegx = /^[a-zA-Z0-9_\.\+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-\.]+$/;
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    const config = {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userInfo.token}`,
        },
    };
    const textFieldRef = useRef(null);
    const focus = () => {
        if (textFieldRef.current) {
            textFieldRef.current.focus();
        }
    };
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [totalRows, setTotalRows] = React.useState(0);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(false);
    const [success, setSuccess] = React.useState(false);
    const [rights, setRights] = useState();
    const [isEdit, setIsEdit] = React.useState(false);
    const [formData, setFormData] = useState({
        userFirstName: '',
        userLastName: '',
        userGender: '',
        userName: '',
        password: '',
        emailId: '',
        userRights: ''
    });
    const [formDataError, setFormDataError] = useState({
        userFirstName: false,
        userLastName: false,
        userGender: false,
        userName: false,
        password: false,
        emailId: false,
        userRights: false
    })
    const [state, setState] = useState([
        {
            startDate: new Date(),
            endDate: new Date(),
            key: 'selection'
        }
    ]);
    const [fields, setFields] = useState([
        'userFirstName',
        'userLastName',
        'userGender',
        'userName',
        'password',
        'emailId',
        'userRights',
    ])
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const [filter, setFilter] = React.useState(false);
    const id = open ? 'simple-popover' : undefined;
    const [sourceList, setSourceList] = React.useState();
    const [categories, setCategories] = React.useState();
    const [subCategories, setSubCategories] = React.useState();
    const [tab, setTab] = React.useState(1);
    const [openModal, setOpen] = React.useState(false);
    const navigate = useNavigate();
    const [value, setValue] = useState({
        startDate: null,
        endDate: null
    });
    const decryptData = (text) => {
        const key = process.env.REACT_APP_AES_KEY;
        const bytes = CryptoJS.AES.decrypt(text, key);
        const data = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        return (data);
    };
    const user = JSON.parse(localStorage.getItem('userInfo'))
    let location = useLocation();
    if (!user) {
        return (<Navigate to="/login" state={{ from: location }} replace />)
    }
    const role = user.userRights ? decryptData(user.userRights) : '';
    const decoded = jwt_decode(user.token);
    const expirationTime = (decoded.exp * 1000) - 60000

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const handleOpen = () => setOpen(true);
    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }))
    }
    const handleCloseModal = () => {
        // setOpen(false);
        // setCategory('');
        // setCategoryError(false);
        // setEditCategory({
        //     stockOutCategoryName: '',
        //     stockOutCategoryId: ''
        // });
        // setIsEdit(false);
        setOpen(false)
    }
    const handleExpenseDate = (date) => {
        setFormData((prevState) => ({
            ...prevState,
            ["expenseDate"]: date && date['$d'] ? date['$d'] : null,
        }))
    };
    const handleSourceNameAutoComplete = (event, value) => {
        formData((prevState) => ({
            ...prevState,
            ['source']: value,
            sourceId: value && value.productId ? value.productId : '',
        }))
        // getSuppilerList(value && value.productId ? value.productId : '')
        // console.log('formddds', stockInFormData)
    }
    const handleValueChange = (newValue) => {
        setValue(newValue);
    }
    const goToAddUSer = () => {
        const auth = new Date(expirationTime) > new Date() && (role == 1) ? true : false
        if (auth) {
            navigate('/addUser')
        } else {
            if (window.confirm("You are not Authorised. You want to Login again ?")) {
                navigate('/login')
            }
        }
    }
    const goToUserList = () => {
        const auth = new Date(expirationTime) > new Date() && (role == 1) ? true : false
        if (auth) {
            navigate('/userTable')
        } else {
            if (window.confirm("You are not Authorised. You want to Login again ?")) {
                navigate('/login')
            }
        }
    }
    const goToExpense = () => {
        const auth = new Date(expirationTime) > new Date() && (role == 1 || role == 2) ? true : false
        if (auth) {
            navigate('/expense/dashboard')
        } else {
            if (window.confirm("You are not Authorised. You want to Login again ?")) {
                navigate('/login')
            }
        }
    }
    const goToStaff = () => {
        const auth = new Date(expirationTime) > new Date() && (role == 1 || role == 2) ? true : false
        if (auth) {
            navigate('/staff/staffList')
        } else {
            if (window.confirm("You are not Authorised. You want to Login again ?")) {
                navigate('/login')
            }
        }
    }
    const goToProductList = () => {
        navigate('/productList')
    }
    return (
        <div className='mainBody'>
            <div className='productListContainer'>
                <div className='grid grid-cols-12'>
                    <div className='col-span-12'>
                        <div className='productTableSubContainer'>
                            <div className='h-full grid grid-cols-12'>
                                <div className='h-full mobile:col-span-10  tablet1:col-span-10  tablet:col-span-7  laptop:col-span-7  desktop1:col-span-7  desktop2:col-span-7  desktop2:col-span-7 '>
                                    <div className='grid grid-cols-12 pl-6 gap-3 h-full'>
                                        <div className={`flex col-span-3 justify-center ${tab === 1 || tab === '1' ? 'productTabAll' : 'productTab'}`} onClick={() => {
                                            setTab(1)
                                        }}>
                                            <div className='statusTabtext'>Dashboard</div>
                                        </div>
                                        <div className={`flex col-span-3 justify-center ${tab === 2 || tab === '2' ? 'productTabIn' : 'productTab'}`} onClick={() => {
                                            setTab(2);
                                        }}>
                                            <div className='statusTabtext'>Add Expenses</div>
                                        </div>
                                        <div className={`flex col-span-3 justify-center ${tab === 3 || tab === '3' ? 'productTabOut' : 'productTab'}`} onClick={() => {
                                            setTab(3)
                                        }}>
                                            <div className='statusTabtext'>Today's Expenses</div>
                                        </div>
                                        <div className={`flex col-span-3 justify-center ${tab === 4 || tab === '4' ? 'products' : 'productTab'}`} onClick={() => {
                                            setTab(4)
                                        }}>
                                            <div className='statusTabtext'>Category Table</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {
                (tab === 1 || tab === '1') &&
                <div className="cardWrp">
                    <div className="grid lg:grid-cols-3 mobile:grid-cols-2 tablet1:grid-cols-3 tablet:grid-cols-4 laptop:grid-cols-4 desktop1:grid-cols-4 desktop2:grid-cols-4 desktop2:grid-cols-4 gap-6">
                        <CategoryCard goToAddUSer={goToProductList} name={"Home"} imgName={'img11'} />
                        <CategoryCard goToAddUSer={goToStaff} name={"Restaurant"} imgName={'img11'} />
                        <CategoryCard goToAddUSer={goToProductList} name={"Other"} imgName={'img11'} />
                        <CategoryCard goToAddUSer={goToStaff} name={"Debit"} imgName={'img11'} />
                        {/* <ConsoleCard goToAddUSer={goToAddUSer} name={"Add User"} imgName={'userAdd'} />
                        <ConsoleCard goToAddUSer={goToUserList} name={"User List"} imgName={'userList'} />
                        <ConsoleCard goToAddUSer={goToExpense} name={"Expense"} imgName={'expense'} /> */}
                    </div>
                </div>
            }
            {
                (tab === 2 || tab === '2') &&
                <div className="grid grid-cols-12">
                    <div className="col-span-9">
                        <div className="addCard">
                            <div className='addUserTextFieldWrp'>
                                <div className='grid grid-rows-2 gap-6'>
                                    <div className='grid grid-cols-12 gap-6'>
                                        <div className="col-span-4">
                                            <FormControl fullWidth>
                                                <Autocomplete
                                                    defaultValue={null}
                                                    id='source'
                                                    disablePortal
                                                    sx={{ width: '100%' }}
                                                    // disabled={isEdit}
                                                    value={formData.source ? formData.source : null}
                                                    onChange={handleSourceNameAutoComplete}
                                                    options={sourceList ? sourceList : []}
                                                    getOptionLabel={(options) => options.productName}
                                                    renderInput={(params) => <TextField inputRef={textFieldRef} {...params} label="Money Source" />}
                                                />
                                            </FormControl>
                                        </div>
                                        <div className="col-span-4">
                                            <FormControl fullWidth>
                                                <Autocomplete
                                                    defaultValue={null}
                                                    id='category'
                                                    disablePortal
                                                    sx={{ width: '100%' }}
                                                    // disabled={isEdit}
                                                    value={formData.categories ? formData.categories : null}
                                                    onChange={handleSourceNameAutoComplete}
                                                    options={categories ? categories : []}
                                                    getOptionLabel={(options) => options.productName}
                                                    renderInput={(params) => <TextField {...params} label="Category" />}
                                                />
                                            </FormControl>
                                        </div>
                                        <div className="col-span-4">
                                            <FormControl fullWidth>
                                                <Autocomplete
                                                    defaultValue={null}
                                                    id='subCategory'
                                                    disablePortal
                                                    sx={{ width: '100%' }}
                                                    // disabled={isEdit}
                                                    value={formData.subCategory ? formData.subCategory : null}
                                                    onChange={handleSourceNameAutoComplete}
                                                    options={subCategories ? subCategories : []}
                                                    getOptionLabel={(options) => options.productName}
                                                    renderInput={(params) => <TextField {...params} label="Sub Category" />}
                                                />
                                            </FormControl>
                                        </div>
                                    </div>
                                    <div className='grid grid-cols-12 gap-6'>
                                        <div className="col-span-4">
                                            <TextField
                                                error={formDataError.emailId}
                                                helperText={formDataError.emailId ? "Please Enter valid Email" : ''}
                                                onChange={onChange}
                                                value={formData.emailId}
                                                name="emailId"
                                                id="outlined-required"
                                                label="Amount"
                                                InputProps={{ style: { fontSize: 14 } }}
                                                InputLabelProps={{ style: { fontSize: 14 } }}
                                                fullWidth
                                            />
                                        </div>
                                        <div className="col-span-4">
                                            <TextField
                                                // onBlur={(e) => {
                                                //     if (e.target.value.length < 2) {
                                                //         setFormDataError((perv) => ({
                                                //             ...perv,
                                                //             userName: true
                                                //         }))
                                                //     }
                                                //     else {
                                                //         setFormDataError((perv) => ({
                                                //             ...perv,
                                                //             userName: false
                                                //         }))
                                                //     }
                                                // }}
                                                onChange={onChange}
                                                value={formData.userName}
                                                error={formDataError.userName}
                                                helperText={formDataError.userName ? "Please Enter First Name" : ''}
                                                name="userName"
                                                id="outlined-required"
                                                label="Comment"
                                                InputProps={{ style: { fontSize: 14 } }}
                                                InputLabelProps={{ style: { fontSize: 14 } }}
                                                fullWidth
                                            />
                                        </div>
                                        <div className="col-span-4">
                                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                <DesktopDatePicker
                                                    textFieldStyle={{ width: '100%' }}
                                                    InputProps={{ style: { fontSize: 14, width: '100%' } }}
                                                    InputLabelProps={{ style: { fontSize: 14 } }}
                                                    label="Stock In Date"
                                                    format="DD/MM/YYYY"
                                                    required
                                                    error={formDataError.expenseDate}
                                                    value={formData.expenseDate}
                                                    onChange={handleExpenseDate}
                                                    name="expenseDate"
                                                    slotProps={{ textField: { fullWidth: true } }}
                                                    renderInput={(params) => <TextField {...params} sx={{ width: '100%' }} />}
                                                />
                                            </LocalizationProvider>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='addUserBtnContainer grid grid-rows-1'>
                                <div className='grid grid-cols-12 gap-6'>
                                    <div className='col-start-4 col-span-3'>
                                        <button onClick={() => { }} className='saveBtn' >Save</button>
                                    </div>
                                    <div className='col-span-3'>
                                        <button onClick={() => { }} className='resetBtn'>reset</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            }
            {(tab === 3 || tab === '3') &&
                <div className='grid grid-cols-12 mt-6 tableCardMargin'>
                    <div className='col-span-12'>
                        <div className='userTableSubContainer'>
                            <div className='grid grid-cols-12 pt-6'>
                                <div className='ml-6 col-span-6' >
                                </div>
                            </div>
                            <div className='tableContainerWrapper'>
                                <TableContainer sx={{ borderBottomLeftRadius: '10px', borderBottomRightRadius: '10px', paddingLeft: '10px', paddingRight: '10px' }} component={Paper}>
                                    <Table sx={{ minWidth: 650 }} stickyHeader aria-label="sticky table">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>No.</TableCell>
                                                <TableCell>Entered By</TableCell>
                                                <TableCell align="left">Product Name</TableCell>
                                                <TableCell align="left">Qty</TableCell>
                                                <TableCell align="right">Price</TableCell>
                                                <TableCell align="right">Total Price</TableCell>
                                                <TableCell align="left">Bill No.</TableCell>
                                                <TableCell align="left">Supplier</TableCell>
                                                <TableCell align="left">Pay Mode</TableCell>
                                                <TableCell align="left">Comment</TableCell>
                                                <TableCell align="left">Date</TableCell>
                                                <TableCell align="left"></TableCell>
                                            </TableRow>
                                        </TableHead>
                                        {/* <TableBody>
                                            {stockInData?.map((row, index) => (
                                                totalRows !== 0 ?
                                                    <TableRow
                                                        hover
                                                        key={row.stockInId}
                                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                        style={{ cursor: "pointer" }}
                                                        className='tableRow'
                                                    >
                                                        <TableCell align="left" >{(index + 1) + (page * rowsPerPage)}</TableCell>
                                                        <Tooltip title={row.userName} placement="top-start" arrow>
                                                            <TableCell component="th" scope="row">
                                                                {row.enteredBy}
                                                            </TableCell>
                                                        </Tooltip>
                                                        <TableCell align="left" >{row.productName}</TableCell>
                                                        <TableCell align="left" >{row.Quantity}</TableCell>
                                                        <TableCell align="right" >{parseFloat(row.productPrice ? row.productPrice : 0).toLocaleString('en-IN')}</TableCell>
                                                        <TableCell align="right" >{parseFloat(row.totalPrice ? row.totalPrice : 0).toLocaleString('en-IN')}</TableCell>
                                                        <TableCell align="left" >{row.billNumber}</TableCell>
                                                        <TableCell align="left" >{row.supplier}</TableCell>
                                                        <TableCell align="left" >{row.stockInPaymentMethod}</TableCell>
                                                        <Tooltip title={row.stockInComment} placement="top-start" arrow><TableCell align="left" ><div className='Comment'>{row.stockInComment}</div></TableCell></Tooltip>
                                                        <TableCell align="left" >{row.stockInDate}</TableCell>
                                                        <TableCell align="right">
                                                            <MenuStockInOut handleAccordionOpenOnEdit={handleAccordionOpenOnEdit} stockInOutId={row.stockInId} data={row} deleteStockInOut={handleDeleteStockIn} setError={setError} />
                                                        </TableCell>
                                                    </TableRow> :
                                                    <TableRow
                                                        key={row.userId}
                                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                    >
                                                        <TableCell align="left" style={{ fontSize: "18px" }} >{"No Data Found...!"}</TableCell>
                                                    </TableRow>

                                            ))}
                                        </TableBody> */}
                                    </Table>
                                    <TablePagination
                                        rowsPerPageOptions={[5, 10, 25]}
                                        component="div"
                                        count={totalRows}
                                        rowsPerPage={rowsPerPage}
                                        page={page}
                                    // onPageChange={handleChangePage}
                                    // onRowsPerPageChange={handleChangeRowsPerPage}
                                    />
                                </TableContainer>
                            </div>
                        </div>
                    </div>
                </div>
            }
            {
                (tab === 4 || tab === '4') &&
                <div className='grid grid-cols-12 mt-6'>
                    <div className='col-span-12 tableCardMargin'>
                        <div className='userTableSubContainer pt-4'>
                            <div className='grid grid-cols-12'>
                                <div className='ml-4 col-span-6' >
                                    <div className='flex'>
                                        <div className='dateRange text-center' aria-describedby={id} onClick={handleClick}>
                                            <CalendarMonthIcon className='calIcon' />&nbsp;&nbsp;{(state[0].startDate && filter ? state[0].startDate.toDateString() : 'Select Date')} -- {(state[0].endDate && filter ? state[0].endDate.toDateString() : 'Select Date')}
                                        </div>
                                        <div className='resetBtnWrap col-span-3'>
                                            <button className={`${!filter ? 'reSetBtn' : 'reSetBtnActive'}`} onClick={() => {
                                                setFilter(false);
                                                // getData();
                                                setState([
                                                    {
                                                        startDate: new Date(),
                                                        endDate: new Date(),
                                                        key: 'selection'
                                                    }
                                                ])
                                            }}><CloseIcon /></button>
                                        </div>
                                    </div>
                                    <Popover
                                        id={id}
                                        open={open}
                                        style={{ zIndex: 10000, borderRadius: '10px', boxShadow: 'rgba(0, 0, 0, 0.1) 0rem 0.25rem 0.375rem -0.0625rem, rgba(0, 0, 0, 0.06) 0rem 0.125rem 0.25rem -0.0625rem' }}
                                        anchorEl={anchorEl}
                                        onClose={handleClose}
                                        anchorOrigin={{
                                            vertical: 'bottom',
                                            horizontal: 'left',
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
                                                    <button className='stockInBtn' onClick={() => { }
                                                        // { getDataByFilter(); setFilter(true); setPage(0); handleClose() }
                                                    }>Apply</button>
                                                </div>
                                                <div className='col-span-3'>
                                                    <button className='stockOutBtn' onClick={handleClose}>cancle</button>
                                                </div>
                                            </div>
                                        </Box>
                                    </Popover>
                                </div>
                                <div className='col-span-2  pr-5 flex justify-end'>
                                    <button className='exportExcelBtn' onClick={() => { }
                                        // excelExportProductWise()
                                    }><FileDownloadIcon />&nbsp;&nbsp;Product Wise</button>
                                </div>
                                <div className='col-span-2 pr-5 flex justify-end'>
                                    <button className='exportExcelBtn' onClick={() => { }
                                        // pdfExportCategoryWise()
                                    }><FileDownloadIcon />&nbsp;&nbsp;Category Wise</button>
                                </div>
                                <div className='col-span-2 col-start-11 mr-6'>
                                    <div className='flex justify-end'>
                                        <button className='addCategoryBtn' onClick={handleOpen}>Add Category</button>
                                    </div>
                                </div>
                            </div>
                            <div className='tableContainerWrapper'>
                                <TableContainer sx={{ borderBottomLeftRadius: '10px', borderBottomRightRadius: '10px', paddingLeft: '10px', paddingRight: '10px' }} component={Paper}>
                                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>No.</TableCell>
                                                <TableCell>Category Name</TableCell>
                                                <TableCell align="right">Used Cost</TableCell>
                                                <TableCell align="right">Percentage</TableCell>
                                                <TableCell align="right"></TableCell>
                                                <TableCell align="right"></TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {/* {data?.map((row, index) => (
                                        totalRows !== 0 ?
                                            <TableRow
                                                hover
                                                key={row.stockOutCategoryId}
                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                style={{ cursor: "pointer" }}
                                                className='tableRow'
                                            >
                                                <TableCell align="left" onClick={() => navigateToDetail(row.stockOutCategoryName, row.stockOutCategoryId)}>{(index + 1) + (page * rowsPerPage)}</TableCell>
                                                <TableCell component="th" scope="row" onClick={() => navigateToDetail(row.stockOutCategoryName, row.stockOutCategoryId)}>
                                                    {row.stockOutCategoryName}
                                                </TableCell>
                                                <TableCell align="right" onClick={() => navigateToDetail(row.stockOutCategoryName, row.stockOutCategoryId)}>{parseFloat(row.outPrice ? row.outPrice : 0).toLocaleString('en-IN')}</TableCell>
                                                <TableCell align="right" onClick={() => navigateToDetail(row.stockOutCategoryName, row.stockOutCategoryId)}>{row.percentage}</TableCell>
                                                <TableCell align="right" ><div className=''><button className='editCategoryBtn mr-6' onClick={() => handleEdit(row.stockOutCategoryId, row.stockOutCategoryName)}>Edit</button><button className='deleteCategoryBtn' onClick={() => handleDelete(row.stockOutCategoryId)}>Delete</button></div></TableCell>
                                                <TableCell align="right">
                                                </TableCell>
                                            </TableRow> :
                                            <TableRow
                                                key={row.userId}
                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                            >
                                                <TableCell align="left" style={{ fontSize: "18px" }} >{"No Data Found...!"}</TableCell>
                                            </TableRow>

                                    ))} */}
                                        </TableBody>
                                    </Table>
                                    <TablePagination
                                        rowsPerPageOptions={[5, 10, 25]}
                                        component="div"
                                        count={totalRows}
                                        rowsPerPage={rowsPerPage}
                                        page={page}
                                    // onPageChange={handleChangePage}
                                    // onRowsPerPageChange={handleChangeRowsPerPage}
                                    />
                                </TableContainer>
                            </div>
                        </div>
                    </div>
                    <Modal
                        open={openModal}
                        onClose={handleCloseModal}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                    >
                        <Box sx={style}>
                            <Typography id="modal-modal-title" variant="h6" component="h2">
                                {isEdit ? 'Edit Category' : 'Add Category'}
                            </Typography>
                            {/* <div className='mt-6 grid grid-cols-12 gap-6'>
                        <div className='col-span-6'>
                            <TextField
                                onBlur={(e) => {
                                    if (e.target.value.length < 2) {
                                        setCategoryError(true);
                                    }
                                    else {
                                        setCategoryError(false)
                                    }
                                }}
                                onChange={(e) => {
                                    isEdit ? setEditCategory((perv) => ({
                                        ...perv,
                                        stockOutCategoryName: e.target.value
                                    })) : setCategory(e.target.value)
                                }}
                                value={isEdit ? editCateory.stockOutCategoryName ? editCateory.stockOutCategoryName : '' : category}
                                error={categoryError ? true : false}
                                inputRef={textFieldRef}
                                helperText={categoryError ? "Please Enter Category" : ''}
                                name="category"
                                id="outlined-required"
                                label="Category"
                                InputProps={{ style: { fontSize: 14 } }}
                                InputLabelProps={{ style: { fontSize: 14 } }}
                                fullWidth
                            />
                        </div>
                        <div className='col-span-3'>
                            <button className='addCategorySaveBtn' onClick={() => {
                                isEdit ? editCategory() : submit()
                            }}>{isEdit ? 'Save' : 'Add'}</button>
                        </div>
                        <div className='col-span-3'>
                            <button className='addCategoryCancleBtn' onClick={() => {
                                handleCloseModal(); setEditCategory((perv) => ({
                                    ...perv,
                                    stockOutCategoryId: '',
                                    stockOutCategoryName: ''
                                }));
                                setIsEdit(false)
                            }}>Cancle</button>
                        </div>
                    </div> */}
                        </Box>
                    </Modal>
                    <ToastContainer />
                </div >
            }
            <ToastContainer />
        </div>
    )
}

export default ExpenseDashboard;