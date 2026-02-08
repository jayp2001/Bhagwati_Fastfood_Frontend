import './allBillView.css';
import { useState, useEffect, useRef } from "react";
import React from "react";
import { BACKEND_BASE_URL } from '../../../url';
import axios from 'axios';
import CloseIcon from '@mui/icons-material/Close';
import RestoreIcon from '@mui/icons-material/Restore';
import SearchIcon from '@mui/icons-material/Search';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import VisibilityIcon from '@mui/icons-material/Visibility';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Popover from '@mui/material/Popover';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import BillDetailsModal from '../../../components/BillDetailsModal/BillDetailsModal';

function AllBillView() {
    const [billCategories, setBillCategories] = useState([]);
    const [selectedTab, setSelectedTab] = useState(0);
    const [billDate, setBillDate] = useState(dayjs());
    const [billData, setBillData] = useState([]);
    const [error, setError] = useState(false);
    const [billModalOpen, setBillModalOpen] = useState(false);
    const [billModalId, setBillModalId] = useState(null);
    const scrollContainerRef = useRef(null);
    const [showPrev, setShowPrev] = useState(false);
    const [showNext, setShowNext] = useState(false);
    const [searchToken, setSearchToken] = useState('');

    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    const config = {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userInfo.token}`,
        },
    };

    const getBillCategories = async () => {
        await axios.get(`${BACKEND_BASE_URL}billingrouter/ddlBillCategory`, config)
            .then((res) => {
                const data = Array.isArray(res.data) ? res.data : (res.data?.rows || []);
                setBillCategories(data);
                if (data.length > 0 && selectedTab >= data.length) {
                    setSelectedTab(0);
                }
            })
            .catch((err) => {
                setError(err.response ? err.response.data : "Network Error ...!!!");
            });
    };

    const fetchOrders = async () => {
        const dateStr = (billDate && typeof billDate.toDate === 'function')
            ? billDate.toDate().toDateString()
            : (billDate?.$d ? new Date(billDate.$d).toDateString() : new Date().toDateString());
        const billType = billCategories[selectedTab] || '';
        const url = `${BACKEND_BASE_URL}billingrouter/getAllOrdersData?billDate=${encodeURIComponent(dateStr)}&billType=${encodeURIComponent(billType)}`;
        await axios.get(url, config)
            .then((res) => {
                const rows = Array.isArray(res.data) ? res.data : (res.data?.rows || []);
                setBillData(rows);
            })
            .catch((err) => {
                setBillData([]);
                setError(err.response ? err.response.data : "Network Error ...!!!");
            });
    };

    useEffect(() => {
        getBillCategories();
    }, []);

    useEffect(() => {
        if (billCategories.length > 0) {
            fetchOrders();
        }
    }, [billCategories, selectedTab, billDate]);

    useEffect(() => {
        setSearchToken('');
    }, [selectedTab]);

    const handleDateChange = (date) => {
        setBillDate(date || dayjs());
    };

    const isCurrentDateSelected = billDate
        ? dayjs(billDate).format('YYYY-MM-DD') === dayjs().format('YYYY-MM-DD')
        : true;

    const filteredBillData = billData.filter((row) => {
        const token = (row.tokenNo || row.billNumber || '').toString().toLowerCase();
        return !searchToken.trim() || token.includes(searchToken.trim().toLowerCase());
    });

    const scrollLeft = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ left: -200, behavior: 'smooth' });
        }
    };

    const scrollRight = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ left: 200, behavior: 'smooth' });
        }
    };

    const updateButtons = () => {
        if (scrollContainerRef.current) {
            const { scrollLeft: sl, scrollWidth, clientWidth } = scrollContainerRef.current;
            setShowPrev(sl > 0);
            setShowNext(sl + clientWidth < scrollWidth);
        }
    };

    useEffect(() => {
        const container = scrollContainerRef.current;
        if (container) {
            updateButtons();
            container.addEventListener('scroll', updateButtons);
            window.addEventListener('resize', updateButtons);
        }
        return () => {
            if (container) {
                container.removeEventListener('scroll', updateButtons);
            }
            window.removeEventListener('resize', updateButtons);
        };
    }, [billCategories]);

    if (error) {
        toast.dismiss();
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

    return (
        <div className='suppilerListContainer allBillViewContainer'>
            <div className='grid grid-cols-12 mt-6'>
                <div className='col-span-12'>
                    <div className='productTableSubContainer static'>
                        <div className='h-full grid grid-cols-12'>
                            <div className='h-full col-span-10'>
                                <div className='relative h-full'>
                                    {showPrev && (
                                        <button onClick={scrollLeft} className='absolute left-3 z-10 top-5'>
                                            <ChevronLeftIcon />
                                        </button>
                                    )}
                                    <div
                                        className='flex ml-12 gap-3 menuCategoryScroll overflow-x-auto h-full'
                                        style={{ whiteSpace: 'nowrap' }}
                                        ref={scrollContainerRef}
                                    >
                                        {billCategories.map((category, index) => (
                                            <div
                                                key={index}
                                                className={`col-span-1 ${selectedTab === index ? 'productTabAll' : 'productTab'}`}
                                                onClick={() => setSelectedTab(index)}
                                                style={{ minWidth: 'fit-content' }}
                                            >
                                                <div className='statusTabtext w-40'>{category}</div>
                                            </div>
                                        ))}
                                    </div>
                                    {showNext && (
                                        <button onClick={scrollRight} className='absolute -right-5 z-10 top-5'>
                                            <ChevronRightIcon />
                                        </button>
                                    )}
                                </div>
                            </div>
                            <div className='col-span-2 flex justify-end pr-4 items-center gap-2'>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DesktopDatePicker
                                        label="Bill Date"
                                        format="DD/MM/YYYY"
                                        value={billDate}
                                        onChange={handleDateChange}
                                        slotProps={{
                                            textField: {
                                                size: 'small',
                                                sx: { minWidth: 160 },
                                                inputProps: { readOnly: true }
                                            }
                                        }}
                                    />
                                </LocalizationProvider>
                                <button
                                    className={`reSetBtn ${!isCurrentDateSelected ? 'resetDateBtnActive' : ''}`}
                                    onClick={() => setBillDate(dayjs())}
                                    title="Reset to today"
                                >
                                    <RestoreIcon sx={{ fontSize: 20, opacity: 1 }} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className='userTableSubContainer mt-6 pt-4'>
                <div className='flex justify-end items-center gap-2 mb-3 pr-4'>
                    <TextField
                        size="small"
                        placeholder="Search by Token No"
                        value={searchToken}
                        onChange={(e) => setSearchToken(e.target.value)}
                        sx={{ minWidth: 220 }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon fontSize="small" />
                                </InputAdornment>
                            ),
                        }}
                    />
                    <button
                        className={`reSetBtn ${searchToken ? 'resetDateBtnActive' : ''}`}
                        onClick={() => setSearchToken('')}
                        title="Reset search"
                    >
                        <RestoreIcon sx={{ fontSize: 20, opacity: 1 }} />
                    </button>
                </div>
                <div className='tableContainerWrapper'>
                    <TableContainer
                        sx={{
                            borderBottomLeftRadius: '10px',
                            borderBottomRightRadius: '10px',
                            paddingLeft: '10px',
                            paddingRight: '10px'
                        }}
                        component={Paper}
                    >
                        <Table sx={{ minWidth: 650 }} stickyHeader aria-label="sticky table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>No.</TableCell>
                                    <TableCell>Token Number</TableCell>
                                    <TableCell>Cashier</TableCell>
                                    <TableCell>Payment Type</TableCell>
                                    <TableCell align="center">Total Amount</TableCell>
                                    <TableCell align="center">Settled Amount</TableCell>
                                    <TableCell align="left">Bill Date</TableCell>
                                    <TableCell align="left">Time</TableCell>
                                    <TableCell align="center">Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredBillData && filteredBillData.length > 0 ? (
                                    filteredBillData.map((row, index) => (
                                        <TableRow
                                            hover
                                            key={row.billId || index}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                            className='tableRow'
                                        >
                                            <TableCell align="left">{index + 1}</TableCell>
                                            <TableCell component="th" scope="row">
                                                {row.tokenNo || row.billNumber}
                                            </TableCell>
                                            <TableCell align="left">{row.cashier}</TableCell>
                                            <TableCell align="left" style={{ textTransform: 'capitalize' }}>
                                                {row.billPayType}
                                            </TableCell>
                                            <TableCell align="center" className="greenText">
                                                ₹{parseFloat(row.totalAmount || 0).toLocaleString('en-IN')}
                                            </TableCell>
                                            <TableCell align="center" className="greenText">
                                                ₹{parseFloat(row.settledAmount || 0).toLocaleString('en-IN')}
                                            </TableCell>
                                            <TableCell align="left">{row.billDate}</TableCell>
                                            <TableCell align="left">{row.billCreationDate || row.billTime}</TableCell>
                                            <TableCell align="center">
                                                <IconButton
                                                    size="small"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setBillModalId(row.billId);
                                                        setBillModalOpen(true);
                                                    }}
                                                    sx={{
                                                        width: 32,
                                                        height: 32,
                                                        backgroundColor: '#1976d2',
                                                        color: 'white',
                                                        '&:hover': { backgroundColor: '#1565c0' },
                                                    }}
                                                >
                                                    <VisibilityIcon sx={{ fontSize: 18 }} />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow key="no-data" sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                        <TableCell
                                            align="center"
                                            style={{ fontSize: "18px", fontWeight: "500", padding: "40px" }}
                                            colSpan={9}
                                        >
                                            No Data Found...!
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>
            </div>

            <BillDetailsModal
                open={billModalOpen}
                onClose={() => { setBillModalOpen(false); setBillModalId(null); }}
                billId={billModalId}
                onError={(msg) => setError(msg)}
            />
            <ToastContainer />
        </div>
    );
}

export default AllBillView;
