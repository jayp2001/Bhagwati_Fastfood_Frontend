import './customerDetails.css';
import { useState, useEffect } from "react";
import React from "react";
import { BACKEND_BASE_URL } from '../../../url';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import SimpleCountCard from '../../../billingPages/countCard/simpleCountCard';
import CloseIcon from '@mui/icons-material/Close';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import Popover from '@mui/material/Popover';
import { DateRangePicker } from 'react-date-range';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css';
import Box from '@mui/material/Box';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination';
import Paper from '@mui/material/Paper';
import { Select, MenuItem, FormControl, InputLabel, Modal, IconButton } from '@mui/material';
import TuneIcon from '@mui/icons-material/Tune';
import Popper from '@mui/material/Popper';
import VisibilityIcon from '@mui/icons-material/Visibility';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import BillDetailsModal from '../../../components/BillDetailsModal/BillDetailsModal';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 750,
    maxHeight: '88vh',
    bgcolor: 'background.paper',
    boxShadow: 24,
    borderRadius: '8px',
    display: 'flex',
    flexDirection: 'column'
};

function CustomerDetails() {
    let { id } = useParams();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(false);
    const [success, setSuccess] = React.useState(false);
    const [filter, setFilter] = React.useState(false);
    const [customerDetails, setCustomerDetails] = useState(null);
    const [statisticsCount, setStatisticsCounts] = useState();
    const [detailTab, setDetailTab] = React.useState(1); // Tab for customer details section (1: Info, 2: Statistics)

    // Table state variables
    const [billData, setBillData] = useState([]);
    const [totalRows, setTotalRows] = useState(0);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(15);
    const [billPayType, setBillPayType] = useState('');
    const [billType, setBillType] = useState('');

    // Bill Info Modal state
    const [infoPopUpOpen, setInfoPopUpOpen] = useState(false);
    const [infoPopUpBillId, setInfoPopUpBillId] = useState(null);

    // Filter modal state
    const [anchorElFilter, setAnchorElFilter] = React.useState(null);
    const [filterFormData, setFilterFormData] = React.useState({
        billPayType: "",
        billType: ""
    });
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

    useEffect(() => { }, [state]);

    // Get Customer Details
    const getCustomerDetails = async () => {
        await axios.get(`${BACKEND_BASE_URL}billingrouter/getCustomerDetailsById?customerId=${id}`, config)
            .then((res) => {
                setCustomerDetails(res.data);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }

    // Get Customer Statistics
    const getStatistics = async (startDate = '', endDate = '') => {
        let url = `${BACKEND_BASE_URL}billingrouter/getStaticsByCustomer?customerId=${id}`;
        if (startDate && endDate) {
            url += `&startDate=${encodeURIComponent(startDate)}&endDate=${encodeURIComponent(endDate)}`;
        }
        await axios.get(url, config)
            .then((res) => {
                setStatisticsCounts(res.data);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }

    const getStatisticsByFilter = async () => {
        const startDate = state[0].startDate ? state[0].startDate.toDateString() : '';
        const endDate = state[0].endDate ? state[0].endDate.toDateString() : '';
        await getStatistics(startDate, endDate);
    }

    // Fetch Bills for Customer
    const fetchBills = async (
        pageNum = 1,
        numPerPage = 15,
        includeDateOverride,
        payTypeOverride,
        billTypeOverride
    ) => {
        const includeDate = includeDateOverride !== undefined
            ? includeDateOverride
            : !!(filter && state[0]?.startDate && state[0]?.endDate);
        const startDate = includeDate ? state[0].startDate.toDateString() : '';
        const endDate = includeDate ? state[0].endDate.toDateString() : '';
        const payType = payTypeOverride !== undefined ? payTypeOverride : filterFormData.billPayType;
        const bType = billTypeOverride !== undefined ? billTypeOverride : filterFormData.billType;

        let url = `${BACKEND_BASE_URL}billingrouter/getBillDataBycustomerId?customerId=${id}&page=${pageNum}&numPerPage=${numPerPage}`;
        if (startDate && endDate) {
            url += `&startDate=${encodeURIComponent(startDate)}&endDate=${encodeURIComponent(endDate)}`;
        }

        await axios.get(url, config)
            .then((res) => {
                let rows = res.data.rows || [];
                // Filter by payment type and bill type if provided (client-side filtering)
                if (payType) {
                    rows = rows.filter(row => row.billPayType && row.billPayType.toLowerCase() === payType.toLowerCase());
                }
                if (bType) {
                    rows = rows.filter(row => row.billType === bType);
                }
                setBillData(rows);
                // Use filtered count for totalRows if filters are applied
                setTotalRows((payType || bType) ? rows.length : (res.data.numRows || 0));
            })
            .catch((error) => {
                setBillData([]);
                setTotalRows(0);
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }


    // Handle View Bill - Open modal with billId
    const handleViewBill = (billId) => {
        setInfoPopUpBillId(billId);
        setInfoPopUpOpen(true);
    };


    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    // Filter modal functions
    const handleClickFilter = (event) => {
        setAnchorElFilter(event.currentTarget);
    };
    const handleCloseFilter = () => {
        setAnchorElFilter(null);
    };
    const handleChangeFilter = (e) => {
        setFilterFormData((pervState) => ({
            ...pervState,
            [e.target.name]: e.target.value,
        }));
    };
    const resetFilter = () => {
        setFilterFormData({
            billPayType: "",
            billType: ""
        });
        setBillPayType('');
        setBillType('');
    };

    const open = Boolean(anchorEl);
    const openFilter = Boolean(anchorElFilter);
    const ids = open ? 'simple-popover' : undefined;
    const filterId = openFilter ? 'simple-popover' : undefined;

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
        fetchBills(newPage + 1, rowsPerPage);
    };

    const handleChangeRowsPerPage = (event) => {
        const per = parseInt(event.target.value, 10);
        setRowsPerPage(per);
        setPage(0);
        fetchBills(1, per);
    };

    const handleFilterChange = () => {
        setPage(0);
        fetchBills(1, rowsPerPage);
    };

    const clearFilters = () => {
        setBillPayType('');
        setBillType('');
        setFilterFormData({
            billPayType: "",
            billType: ""
        });
        setPage(0);
        // Clear dropdowns; keep date if active
        fetchBills(1, rowsPerPage, filter, '', '');
    };

    const exportPdf = async () => {
        if (window.confirm('Are you sure you want to Download PDF ... ?')) {
            const startDate = filter && state[0]?.startDate ? state[0].startDate.toDateString() : '';
            const endDate = filter && state[0]?.endDate ? state[0].endDate.toDateString() : '';
            const url = `${BACKEND_BASE_URL}billingrouter/exportPdfForBillDataByCustomerId?customerId=${id}&startDate=${startDate}&endDate=${endDate}`;
            await axios({
                url,
                method: 'GET',
                headers: { Authorization: `Bearer ${userInfo.token}` },
                responseType: 'blob',
            }).then((response) => {
                const href = URL.createObjectURL(response.data);
                const link = document.createElement('a');
                const name = (customerDetails?.customerName || 'Customer') + '_Bills_' + new Date().toLocaleDateString() + '.pdf';
                link.href = href;
                link.setAttribute('download', name);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(href);
            }).catch((err) => {
                if (err.response?.status === 400 || err.response?.status === 404) {
                    const data = err.response?.data;
                    if (data instanceof Blob) {
                        const reader = new FileReader();
                        reader.onload = () => {
                            const message = typeof reader.result === 'string' ? reader.result.trim() : 'No Data Found';
                            setError(message || 'No Data Found');
                        };
                        reader.readAsText(data);
                    } else {
                        setError(typeof data === 'string' ? data : (data?.message || 'No Data Found'));
                    }
                } else {
                    setError(err.response?.data?.message || (typeof err.response?.data === 'string' ? err.response.data : null) || 'Network Error ...!!!');
                }
            });
        }
    };

    useEffect(() => {
        getCustomerDetails();
        getStatistics();
        fetchBills(1, 15);
    }, [])

    if (!customerDetails) {
        return null;
    }

    if (loading) {
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
            setSuccess(false)
        }, 50)
    }
    if (error) {
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
    const formatDate = (isoDate) => {
        if (!isoDate) return '';
        const date = new Date(isoDate);
        return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    };

    // Function to format label from key
    const formatLabel = (key) => {
        // Return the key as-is since API now provides properly formatted keys
        return key;
    };

    // Color mapping for different stat types
    const getColorForKey = (key) => {
        const colorMap = {
            'Pickup Summary': 'purple',
            'Delivery Summary': 'teal',
            'DineIn Summary': 'indigo',
            'Cash Summary': 'blue',
            'Due Summary': 'pink',
            'Online Summary': 'green',
            'Complimentary Summary': 'purple',
            'Cancel Summary': 'orange',
            'Total Discount': 'cyan',
            'Visit': 'yellow',
            'Total Business': 'black',
            'Average Visit Per Month': 'yellow',
            'Average Business Per Year': 'red'
        };
        return colorMap[key] || 'blue';
    };

    // Get statistics keys to display (exclude date/time fields)
    const getStatisticsKeys = () => {
        if (!statisticsCount) return [];
        const excludeKeys = ['Last Visited', 'Last Visited Time'];
        return Object.keys(statisticsCount).filter(key => !excludeKeys.includes(key));
    };

    return (
        <div className='suppilerListContainer'>
            {/* Customer Details & Statistics Section with Tabs */}
            <div className='grid grid-cols-12 gap-6 mt-6'>
                <div className='col-span-12'>
                    <div className='productTableSubContainer'>
                        <div className='h-full grid grid-cols-12'>
                            <div className='h-full col-span-12'>
                                <div className='grid grid-cols-12 pl-2 gap-1 h-full'>
                                    <div
                                        className={`flex col-span-2 justify-center ${detailTab === 1 ? 'productTabAll' : 'productTab'}`}
                                        onClick={() => setDetailTab(1)}
                                    >
                                        <div className='statusTabtext'>Customer Info</div>
                                    </div>
                                    <div
                                        className={`flex col-span-2 justify-center ${detailTab === 2 ? 'productTabAll' : 'productTab'}`}
                                        onClick={() => setDetailTab(2)}
                                    >
                                        <div className='statusTabtext'>Statistics</div>
                                    </div>
                                    <div
                                        className={`flex col-span-2 justify-center ${detailTab === 3 ? 'productTabAll' : 'productTab'}`}
                                        onClick={() => setDetailTab(3)}
                                    >
                                        <div className='statusTabtext'>Bills</div>
                                    </div>
                                    <div className='col-span-6 flex justify-end pr-4'>
                                        <div className={`dateRange text-center self-center ${filter ? 'filterActive' : ''}`} aria-describedby={ids} onClick={handleClick}>
                                            <CalendarMonthIcon className='calIcon' />&nbsp;&nbsp;{(state[0].startDate && filter ? state[0].startDate.toDateString() : 'Select Date')} -- {(state[0].endDate && filter ? state[0].endDate.toDateString() : 'Select Date')}
                                        </div>
                                        <div className='col-span-3 self-center'>
                                            <button
                                                className={`${!filter ? 'reSetBtn' : 'reSetBtnActive'}`}
                                                onClick={() => {
                                                    setFilter(false);
                                                    setPage(0);
                                                    setRowsPerPage(15);
                                                    getStatistics();
                                                    setState([
                                                        {
                                                            startDate: new Date(),
                                                            endDate: new Date(),
                                                            key: 'selection'
                                                        }
                                                    ]);
                                                    fetchBills(1, 15, false);
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
                                                    onChange={item => {
                                                        console.log('DateRangePicker onChange:', item.selection);
                                                        setState([item.selection]);
                                                    }}
                                                    direction="horizontal"
                                                    months={2}
                                                    showSelectionPreview={true}
                                                    moveRangeOnFirstSelection={false}
                                                />
                                                <div className='mt-8 grid gap-4 grid-cols-12'>
                                                    <div className='col-span-3 col-start-7'>
                                                        <button className='stockInBtnCustomerDetails' onClick={() => {
                                                            setFilter(true);
                                                            getStatisticsByFilter();
                                                            fetchBills(page + 1, rowsPerPage, true);
                                                            handleClose();
                                                        }}>Apply</button>
                                                    </div>
                                                    <div className='col-span-3'>
                                                        <button className='stockOutBtnCustomerDetails' onClick={handleClose}>Cancel</button>
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
            </div>

            {/* Tab Content */}
            <div className='mt-3'>
                {detailTab === 1 && (
                    <div className='customerInfoContainer'>
                        <div className='grid grid-cols-12 gap-4'>
                            {/* Left Column - Basic Info Cards */}
                            <div className='col-span-12 lg:col-span-6'>
                                <div className='grid grid-cols-2 gap-3'>
                                    {/* Customer Name Card */}
                                    <div className='infoCard'>
                                        <div className='infoCardLabel'>Customer Name</div>
                                        <div className='infoCardValue'>{customerDetails.customerName || '-'}</div>
                                    </div>
                                    {/* Mobile Number Card */}
                                    <div className='infoCard'>
                                        <div className='infoCardLabel'>Mobile Number</div>
                                        <div className='infoCardValue'>{customerDetails.mobileNumber || '-'}</div>
                                    </div>
                                    {/* Birth Date Card */}
                                    <div className='infoCard'>
                                        <div className='infoCardLabel'>Birth Date</div>
                                        <div className='infoCardValue'>{formatDate(customerDetails.birthDate) || '-'}</div>
                                    </div>
                                    {/* Anniversary Date Card */}
                                    <div className='infoCard'>
                                        <div className='infoCardLabel'>Anniversary Date</div>
                                        <div className='infoCardValue'>{formatDate(customerDetails.anniversaryDate) || '-'}</div>
                                    </div>
                                </div>
                            </div>
                            {/* Right Column - Addresses */}
                            <div className='col-span-12 lg:col-span-6'>
                                <div className='addressSectionContainer'>
                                    <div className='addressSectionHeader'>
                                        <span className='addressSectionTitle'>Addresses</span>
                                        <span className='addressCountBadge'>{customerDetails.addressDetails?.length || 0}</span>
                                    </div>
                                    <div className='addressScrollContainer'>
                                        {customerDetails.addressDetails && customerDetails.addressDetails.length > 0 ? (
                                            customerDetails.addressDetails.map((addr, index) => (
                                                <div key={index} className='addressCard'>
                                                    <div className='addressCardNumber'>{index + 1}</div>
                                                    <div className='addressCardContent'>
                                                        <div className='addressField'>
                                                            <span className='addressFieldLabel'>Address:</span>
                                                            <span className='addressFieldValue'>{addr.address || '-'}</span>
                                                        </div>
                                                        <div className='addressField'>
                                                            <span className='addressFieldLabel'>Locality:</span>
                                                            <span className='addressFieldValue'>{addr.locality || '-'}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className='noAddressMessage'>No addresses found</div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {detailTab === 2 && (
                    <div className='statisticsContainer'>
                        <div className='grid gap-2'>
                            {/* Dynamically render CountCards for all statistics keys */}
                            {getStatisticsKeys().length > 0 ? (
                                (() => {
                                    const keys = getStatisticsKeys();
                                    const rows = [];
                                    for (let i = 0; i < keys.length; i += 3) {
                                        rows.push(
                                            <div key={i} className='grid grid-cols-3 gap-2'>
                                                {keys.slice(i, i + 3).map((key) => (
                                                    <SimpleCountCard
                                                        key={key}
                                                        color={getColorForKey(key)}
                                                        count={statisticsCount[key]}
                                                        desc={formatLabel(key)}
                                                    />
                                                ))}
                                            </div>
                                        );
                                    }
                                    return rows;
                                })()
                            ) : (
                                <div className='text-center py-8 text-gray-500'>No statistics available</div>
                            )}
                            {/* Additional Stats Row - Date/Time */}
                            {(statisticsCount?.['Last Visited'] || statisticsCount?.['Last Visited Time']) && (
                                <div className='grid grid-cols-2 gap-2 mt-1'>
                                    <div className='bg-gray-50 p-3 rounded-lg border border-gray-200'>
                                        <div className='text-xs text-gray-600 mb-1'>Last Visited</div>
                                        <div className='text-sm font-semibold text-gray-800'>{statisticsCount['Last Visited'] || '-'}</div>
                                    </div>
                                    <div className='bg-gray-50 p-3 rounded-lg border border-gray-200'>
                                        <div className='text-xs text-gray-600 mb-1'>Last Visited Time</div>
                                        <div className='text-sm font-semibold text-gray-800'>{statisticsCount['Last Visited Time'] || '-'}</div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {detailTab === 3 && (
                    <div className='billsContainer'>
                        <div className='grid grid-cols-12 pt-6'>
                            <div className='col-span-6 col-start-7 pr-5 flex justify-end'>
                                <button className='exportExcelBtn' onClick={exportPdf}>
                                    <FileDownloadIcon />&nbsp;&nbsp;Export PDF
                                </button>
                            </div>
                        </div>
                        <div className='tableContainerWrapper'>
                            <TableContainer sx={{ borderBottomLeftRadius: '10px', borderBottomRightRadius: '10px', paddingLeft: '10px', paddingRight: '10px' }} component={Paper}>
                                <Table sx={{ minWidth: 650 }} stickyHeader aria-label="sticky table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>No.</TableCell>
                                            <TableCell>Bill Number</TableCell>
                                            <TableCell>Cashier</TableCell>
                                            <TableCell>Bill Type</TableCell>
                                            <TableCell>Payment Type</TableCell>
                                            <TableCell align="center">Total Amount</TableCell>
                                            <TableCell align="center">Settled Amount</TableCell>
                                            <TableCell align="left">Bill Date</TableCell>
                                            <TableCell align="left">Time</TableCell>
                                            <TableCell align="center">Action</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {billData && billData.length > 0 && totalRows > 0 ? (
                                            billData.map((row, index) => (
                                                <TableRow
                                                    hover
                                                    key={row.billId}
                                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                    className='tableRow'
                                                >
                                                    <TableCell align="left">{(index + 1) + (page * rowsPerPage)}</TableCell>
                                                    <TableCell component="th" scope="row">
                                                        {row.billNumber || row.tokenNo}
                                                    </TableCell>
                                                    <TableCell align="left">{row.cashier}</TableCell>
                                                    <TableCell align="left">{row.billType}</TableCell>
                                                    <TableCell align="left" style={{ textTransform: 'capitalize' }}>{row.billPayType}</TableCell>
                                                    <TableCell align="center" className="greenText">₹{parseFloat(row.totalAmount).toLocaleString('en-IN')}</TableCell>
                                                    <TableCell align="center" className="greenText">₹{parseFloat(row.settledAmount).toLocaleString('en-IN')}</TableCell>
                                                    <TableCell align="left">{row.billDate}</TableCell>
                                                    <TableCell align="left">{row.billCreationDate}</TableCell>
                                                    <TableCell align="center">
                                                        <IconButton
                                                            size="small"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleViewBill(row.billId);
                                                            }}
                                                            sx={{
                                                                width: 32,
                                                                height: 32,
                                                                backgroundColor: '#1976d2',
                                                                color: 'white',
                                                                '&:hover': {
                                                                    backgroundColor: '#1565c0',
                                                                },
                                                            }}
                                                        >
                                                            <VisibilityIcon sx={{ fontSize: 18 }} />
                                                        </IconButton>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow
                                                key="no-data-bills"
                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                            >
                                                <TableCell align="center" style={{ fontSize: "18px", fontWeight: "500", padding: "40px" }} colSpan={10}>
                                                    No Data Found...!
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                                <TablePagination
                                    rowsPerPageOptions={[15, 50, 100]}
                                    component="div"
                                    count={totalRows}
                                    rowsPerPage={rowsPerPage}
                                    page={page}
                                    onPageChange={handleChangePage}
                                    onRowsPerPageChange={handleChangeRowsPerPage}
                                />
                            </TableContainer>
                        </div>
                    </div>
                )}
            </div>

            {/* Bill Details Modal */}
            <BillDetailsModal
                open={infoPopUpOpen}
                onClose={() => { setInfoPopUpOpen(false); setInfoPopUpBillId(null); }}
                billId={infoPopUpBillId}
                onError={(msg) => setError(msg)}
            />

            <ToastContainer />
        </div >
    )
}

export default CustomerDetails;