import './transactionTable.css';
import * as React from "react";
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import dayjs from 'dayjs';
import { useState, useEffect } from "react";
import { BACKEND_BASE_URL } from '../../../url';
import axios from 'axios';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import InputAdornment from '@mui/material/InputAdornment';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import Autocomplete from '@mui/material/Autocomplete';
import Tooltip from '@mui/material/Tooltip';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination';
import Paper from '@mui/material/Paper';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css';
import { DateRangePicker } from 'react-date-range';
import Popover from '@mui/material/Popover';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import CloseIcon from '@mui/icons-material/Close';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import CountCard from '../countCard/countCard';
import Menutemp from './menu';
function TransactionTable() {
    const [tab, setTab] = React.useState(2);
    const [cashCount, setCashCount] = React.useState();
    const [debitCount, setDebitCount] = React.useState();
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [totalRows, setTotalRows] = React.useState(0);
    const [totalRowsCash, setTotalRowsCash] = React.useState(0);
    const [debitTransaction, setDebitTransaction] = React.useState();
    const [cashTransaction, setCashTransaction] = React.useState();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [filter, setFilter] = React.useState(false);
    const [state, setState] = useState([
        {
            startDate: new Date(),
            endDate: new Date(),
            key: 'selection'
        }
    ]);
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    const config = {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userInfo.token}`,
        },
    };

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    const getDebitData = async () => {
        await axios.get(`${BACKEND_BASE_URL}inventoryrouter/getDebitTransactionList?&page=${page + 1}&numPerPage=${rowsPerPage}`, config)
            .then((res) => {
                setDebitTransaction(res.data.rows);
                setTotalRows(res.data.numRows);
            })
            .catch((error) => {
                alert(error.response.data)
            })
    }

    const getDebitDataOnPageChange = async (pageNum, rowPerPageNum) => {
        await axios.get(`${BACKEND_BASE_URL}inventoryrouter/getDebitTransactionList?page=${pageNum}&numPerPage=${rowPerPageNum}`, config)
            .then((res) => {
                setDebitTransaction(res.data.rows);
                setTotalRows(res.data.numRows);
            })
            .catch((error) => {
                alert(error.response.data)
            })
    }

    const getDebitDataOnPageChangeByFilter = async (pageNum, rowPerPageNum) => {
        await axios.get(`${BACKEND_BASE_URL}inventoryrouter/getDebitTransactionList?startDate=${state[0].startDate}&endDate=${state[0].endDate}&page=${pageNum}&numPerPage=${rowPerPageNum}`, config)
            .then((res) => {
                setDebitTransaction(res.data.rows);
                setTotalRows(res.data.numRows);
            })
            .catch((error) => {
                alert(error.response.data)
            })
    }

    const getDebitDataByFilter = async () => {
        await axios.get(`${BACKEND_BASE_URL}inventoryrouter/getDebitTransactionList?startDate=${state[0].startDate}&endDate=${state[0].endDate}&page=${1}&numPerPage=${rowsPerPage}`, config)
            .then((res) => {
                setDebitTransaction(res.data.rows);
                setTotalRows(res.data.numRows);
            })
            .catch((error) => {
                alert(error.response.data)
            })
    }
    const getCashDataByFilter = async () => {
        await axios.get(`${BACKEND_BASE_URL}inventoryrouter/getCashTransactionList?startDate=${state[0].startDate}&endDate=${state[0].endDate}&page=${1}&numPerPage=${rowsPerPage}`, config)
            .then((res) => {
                setCashTransaction(res.data.rows);
                setTotalRowsCash(res.data.numRows);
            })
            .catch((error) => {
                alert(error.response.data)
            })
    }

    const getCashData = async () => {
        await axios.get(`${BACKEND_BASE_URL}inventoryrouter/getCashTransactionList?&page=${page + 1}&numPerPage=${rowsPerPage}`, config)
            .then((res) => {
                setCashTransaction(res.data.rows);
                setTotalRowsCash(res.data.numRows);
            })
            .catch((error) => {
                alert(error.response.data)
            })
    }
    const getCashCounts = async () => {
        await axios.get(`${BACKEND_BASE_URL}inventoryrouter/getCashTransactionCounter?`, config)
            .then((res) => {
                setCashCount(res.data);
            })
            .catch((error) => {
                alert(error.response.data)
            })
    }
    const getCashCountsByFilter = async () => {
        await axios.get(`${BACKEND_BASE_URL}inventoryrouter/getCashTransactionCounter?startDate=${state[0].startDate}&endDate=${state[0].endDate}`, config)
            .then((res) => {
                setCashCount(res.data);
            })
            .catch((error) => {
                alert(error.response.data)
            })
    }
    const getDebitCounts = async () => {
        await axios.get(`${BACKEND_BASE_URL}inventoryrouter/getDebitTransactionCounter?`, config)
            .then((res) => {
                setDebitCount(res.data);
            })
            .catch((error) => {
                alert(error.response.data)
            })
    }
    const getDebitCountsByFilter = async () => {
        await axios.get(`${BACKEND_BASE_URL}inventoryrouter/getDebitTransactionCounter?startDate=${state[0].startDate}&endDate=${state[0].endDate}`, config)
            .then((res) => {
                setDebitCount(res.data);
            })
            .catch((error) => {
                alert(error.response.data)
            })
    }


    const getCashDataOnPageChange = async (pageNum, rowPerPageNum) => {
        await axios.get(`${BACKEND_BASE_URL}inventoryrouter/getCashTransactionList?page=${pageNum}&numPerPage=${rowPerPageNum}`, config)
            .then((res) => {
                setCashTransaction(res.data.rows);
                setTotalRowsCash(res.data.numRows);
            })
            .catch((error) => {
                alert(error.response.data)
            })
    }

    const getCashDataOnPageChangeByFilter = async (pageNum, rowPerPageNum) => {
        await axios.get(`${BACKEND_BASE_URL}inventoryrouter/getCashTransactionList?startDate=${state[0].startDate}&endDate=${state[0].endDate}&page=${pageNum}&numPerPage=${rowPerPageNum}`, config)
            .then((res) => {
                setCashTransaction(res.data.rows);
                setTotalRowsCash(res.data.numRows);
            })
            .catch((error) => {
                alert(error.response.data)
            })
    }


    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
        if (tab === '2' || tab === 2) {
            if (filter) {
                getDebitDataOnPageChangeByFilter(1, parseInt(event.target.value, 10))
            }
            else {
                getDebitDataOnPageChange(1, parseInt(event.target.value, 10))
            }
        } else {
            if (filter) {
                getCashDataOnPageChangeByFilter(1, parseInt(event.target.value, 10))
            }
            else {
                getCashDataOnPageChange(1, parseInt(event.target.value, 10))
            }
        }
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
        console.log("page change")
        if (tab === 2 || tab === '2') {
            if (filter) {
                getDebitDataOnPageChangeByFilter(newPage + 1, rowsPerPage)
            }
            else {
                getDebitDataOnPageChange(newPage + 1, rowsPerPage)
            }
        } else {
            if (filter) {
                getCashDataOnPageChangeByFilter(newPage + 1, rowsPerPage)
            }
            else {
                getCashDataOnPageChange(newPage + 1, rowsPerPage)
            }
        }
    };

    const debitExportExcel = async () => {
        if (window.confirm('Are you sure you want to export Excel ... ?')) {
            await axios({
                url: filter ? `${BACKEND_BASE_URL}inventoryrouter/exportExcelSheetForDebitTransactionList?startDate=${state[0].startDate}&endDate=${state[0].endDate}` : `${BACKEND_BASE_URL}inventoryrouter/exportExcelSheetForStockin?startDate=${''}&endDate=${''}`,
                method: 'GET',
                headers: { Authorization: `Bearer ${userInfo.token}` },
                responseType: 'blob', // important
            }).then((response) => {
                // create file link in browser's memory
                const href = URL.createObjectURL(response.data);
                // create "a" HTML element with href to file & click
                const link = document.createElement('a');
                const name = 'bookList' + new Date().toLocaleDateString() + '.xlsx'
                link.href = href;
                link.setAttribute('download', name); //or any other extension
                document.body.appendChild(link);
                link.click();

                // clean up "a" element & remove ObjectURL
                document.body.removeChild(link);
                URL.revokeObjectURL(href);
            });
        }
    }


    const CashExportExcel = async () => {
        if (window.confirm('Are you sure you want to export Excel ... ?')) {
            await axios({
                url: filter ? `${BACKEND_BASE_URL}inventoryrouter/exportExcelSheetForCashTransactionList?startDate=${state[0].startDate}&endDate=${state[0].endDate}` : `${BACKEND_BASE_URL}inventoryrouter/exportExcelSheetForStockin?startDate=${''}&endDate=${''}`,
                method: 'GET',
                headers: { Authorization: `Bearer ${userInfo.token}` },
                responseType: 'blob', // important
            }).then((response) => {
                // create file link in browser's memory
                const href = URL.createObjectURL(response.data);
                // create "a" HTML element with href to file & click
                const link = document.createElement('a');
                const name = 'bookList' + new Date().toLocaleDateString() + '.xlsx'
                link.href = href;
                link.setAttribute('download', name); //or any other extension
                document.body.appendChild(link);
                link.click();

                // clean up "a" element & remove ObjectURL
                document.body.removeChild(link);
                URL.revokeObjectURL(href);
            });
        }
    }
    const deleteData = async (id) => {
        await axios.delete(`${BACKEND_BASE_URL}inventoryrouter/removeSupplierTransactionDetails?supplierTransactionId=${id}`, config)
            .then((res) => {
                alert("data deleted")
            })
            .catch((error) => {
                alert(error.response.data)
            })
    }
    const handleDeleteTransaction = (id) => {
        if (window.confirm("Are you sure you want to delete transaction?")) {
            deleteData(id);
            setTimeout(() => {
                getDebitData();
            }, 1000)
        }
    }
    const getInvoice = async (tId) => {
        if (window.confirm('Are you sure you want to Download Invoice ... ?')) {
            await axios({
                url: `${BACKEND_BASE_URL}inventoryrouter/exportTransactionInvoice?transactionId=${tId}`,
                method: 'GET',
                headers: { Authorization: `Bearer ${userInfo.token}` },
                responseType: 'blob', // important
            }).then((response) => {
                // create file link in browser's memory
                const href = URL.createObjectURL(response.data);
                // create "a" HTML element with href to file & click
                const link = document.createElement('a');
                const name = 'bookList' + new Date().toLocaleDateString() + '.pdf'
                link.href = href;
                link.setAttribute('download', name); //or any other extension
                document.body.appendChild(link);
                link.click();

                // clean up "a" element & remove ObjectURL
                document.body.removeChild(link);
                URL.revokeObjectURL(href);
            });
        }
    }

    useEffect(() => {
        // getCategoryList();
        // getProductList();
        getDebitCounts()
        getDebitData();
        // getCountData();
    }, [])
    return (
        <div className='productListContainer'>
            <div className='grid grid-cols-12'>
                <div className='col-span-12'>
                    <div className='productTableSubContainer'>
                        <div className='h-full grid grid-cols-12'>
                            <div className='h-full mobile:col-span-10  tablet1:col-span-10  tablet:col-span-7  laptop:col-span-7  desktop1:col-span-7  desktop2:col-span-7  desktop2:col-span-7 '>
                                <div className='grid grid-cols-12 pl-6 gap-3 h-full'>
                                    {/* <div className={`flex col-span-3 justify-center ${tab === 1 || tab === '1' || !tab ? 'productTabAll' : 'productTab'}`}
                                        onClick={() => {
                                            setTab(1); setPage(0); setRowsPerPage(5); setFilter(false);
                                            setState([
                                                {
                                                    startDate: new Date(),
                                                    endDate: new Date(),
                                                    key: 'selection'
                                                }
                                            ])
                                        }} >
                                        <div className='statusTabtext'>All</div>
                                    </div> */}
                                    <div className={`flex col-span-3 justify-center ${tab === 2 || tab === '2' ? 'productTabAll' : 'productTab'}`}
                                        onClick={() => {
                                            setTab(2); setPage(0); setRowsPerPage(5); getDebitData(); getDebitCounts(); setFilter(false);
                                            setState([
                                                {
                                                    startDate: new Date(),
                                                    endDate: new Date(),
                                                    key: 'selection'
                                                }
                                            ])
                                        }}>
                                        <div className='statusTabtext'>Debit</div>
                                    </div>
                                    <div className={`flex col-span-3 justify-center ${tab === 3 || tab === '3' ? 'productTabIn' : 'productTab'}`} onClick={() => {
                                        setTab(3); setPage(0); setRowsPerPage(5); getCashData(); setFilter(false); getCashCounts();
                                        setState([
                                            {
                                                startDate: new Date(),
                                                endDate: new Date(),
                                                key: 'selection'
                                            }
                                        ])
                                    }}>
                                        <div className='statusTabtext'>Cash</div>
                                    </div>
                                </div>
                            </div>
                            <div className='col-span-4 col-start-9 flex justify-end pr-4'>
                                <div className='dateRange text-center self-center' aria-describedby={id} onClick={handleClick}>
                                    <CalendarMonthIcon className='calIcon' />&nbsp;&nbsp;{(state[0].startDate && filter ? state[0].startDate.toDateString() : 'Select Date')} -- {(state[0].endDate && filter ? state[0].endDate.toDateString() : 'Select Date')}
                                </div>
                                <div className='resetBtnWrap col-span-3 self-center'>
                                    <button className={`${!filter ? 'reSetBtn' : 'reSetBtnActive'}`} onClick={() => {
                                        setFilter(false);
                                        tab === 2 || tab === '2' ?
                                            getDebitData() : getCashData();
                                        tab === 2 || tab === '2' ?
                                            getDebitCounts() : getCashCounts();
                                        setState([
                                            {
                                                startDate: new Date(),
                                                endDate: new Date(),
                                                key: 'selection'
                                            }
                                        ])
                                    }}><CloseIcon /></button>
                                </div>

                                <Popover
                                    id={id}
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
                                                    tab === 2 || tab === '2' ? getDebitDataByFilter() : getCashDataByFilter();
                                                    tab === 2 || tab === '2' ? getDebitCountsByFilter() : getCashCountsByFilter();
                                                    setFilter(true); setPage(0); handleClose()
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
            {tab === 2 || tab === '2' ?
                <div className='mt-6 grid grid-cols-4 gap-6'>
                    <CountCard color={'blue'} count={debitCount && debitCount.totalExpense ? debitCount.totalExpense : 0} desc={'Total Expense'} />
                    <CountCard color={'green'} count={debitCount && debitCount.totalExpenseOfDebit ? debitCount.totalExpenseOfDebit : 0} desc={'Total Debit'} />
                    <CountCard color={'yellow'} count={debitCount && debitCount.totalPaid ? debitCount.totalPaid : 0} desc={'Paid Debit'} />
                    <CountCard color={'pink'} count={debitCount && debitCount.remainingAmount ? debitCount.remainingAmount : 0} desc={'Total Remaining'} />
                </div> :
                <div className='mt-6 grid grid-cols-4 gap-6'>
                    <CountCard color={'blue'} count={cashCount && cashCount.totalExpense ? cashCount.totalExpense : 0} desc={'Total Expense'} />
                    <CountCard color={'green'} count={cashCount && cashCount.totalExpenseOfCash ? cashCount.totalExpenseOfCash : 0} desc={'Total Cash'} />
                    {/* <CountCard color={'yellow'} count={500} desc={'Paind Debit'} />
                    <CountCard color={'pink'} count={3000} desc={'Total Remaining'} /> */}
                </div>
            }

            <div className='grid grid-cols-12 mt-6'>
                <div className='col-span-12'>
                    <div className='userTableSubContainer'>
                        <div className='grid grid-cols-12 pt-6'>
                            <div className='col-span-6 col-start-7 pr-5 flex justify-end'>
                                <button className='exportExcelBtn' onClick={() => { tab === 1 || tab === '1' ? debitExportExcel() : CashExportExcel() }}><FileDownloadIcon />&nbsp;&nbsp;Export Excle</button>
                            </div>
                        </div>
                        {tab === 2 || tab === '2' ?
                            <div className='tableContainerWrapper'>
                                <TableContainer sx={{ borderBottomLeftRadius: '10px', borderBottomRightRadius: '10px', paddingLeft: '10px', paddingRight: '10px' }} component={Paper}>
                                    <Table sx={{ minWidth: 650 }} stickyHeader aria-label="sticky table">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>No.</TableCell>
                                                <TableCell>Paid By</TableCell>
                                                <TableCell align="left">Suppiler Name</TableCell>
                                                <TableCell align="left">Received By</TableCell>
                                                <TableCell align="right">Pending Amount</TableCell>
                                                <TableCell align="right">Paid Amount</TableCell>
                                                <TableCell align="left">Comment</TableCell>
                                                <TableCell align="left">Date</TableCell>
                                                <TableCell align="left">Time</TableCell>
                                                <TableCell align="left"></TableCell>
                                                {/* <TableCell align="left">Date</TableCell> */}
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {debitTransaction?.map((row, index) => (
                                                totalRows !== 0 ?
                                                    <TableRow
                                                        key={row.supplierTransactionId}
                                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                        style={{ cursor: "pointer" }}
                                                        className='tableRow'
                                                    >
                                                        <TableCell align="left" >{(index + 1) + (page * rowsPerPage)}</TableCell>
                                                        <TableCell component="th" scope="row">
                                                            {row.paidBy}
                                                        </TableCell>
                                                        <TableCell align="left" >{row.supplierNickName}</TableCell>
                                                        <TableCell align="left" >{row.receivedBy}</TableCell>
                                                        <TableCell align="right" >{row.pendingAmount}</TableCell>
                                                        <TableCell align="right" >{row.paidAmount}</TableCell>
                                                        <Tooltip title={row.transactionNote} placement="top-start" arrow><TableCell align="left" ><div className='Comment'>{row.transactionNote}</div></TableCell></Tooltip>
                                                        <TableCell align="left" >{row.transactionDate}</TableCell>
                                                        <TableCell align="left" >{row.transactionTime}</TableCell>
                                                        <TableCell align="right">
                                                            <Menutemp transactionId={row.supplierTransactionId} getInvoice={getInvoice} data={row} deleteTransaction={handleDeleteTransaction} />
                                                        </TableCell>
                                                    </TableRow> :
                                                    <TableRow
                                                        key={row.userId}
                                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                    >
                                                        <TableCell align="left" style={{ fontSize: "18px" }} >{"No Data Found...!"}</TableCell>
                                                    </TableRow>

                                            ))}
                                        </TableBody>
                                    </Table>
                                    <TablePagination
                                        rowsPerPageOptions={[5, 10, 25]}
                                        component="div"
                                        count={totalRows}
                                        rowsPerPage={rowsPerPage}
                                        page={page}
                                        onPageChange={handleChangePage}
                                        onRowsPerPageChange={handleChangeRowsPerPage}
                                    />
                                </TableContainer>
                            </div> :
                            <div className='tableContainerWrapper'>
                                <TableContainer sx={{ borderBottomLeftRadius: '10px', borderBottomRightRadius: '10px', paddingLeft: '10px', paddingRight: '10px' }} component={Paper}>
                                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>No.</TableCell>
                                                <TableCell>Paid By</TableCell>
                                                <TableCell align="left">Recevied By</TableCell>
                                                <TableCell align="left">Paid Amount</TableCell>
                                                <TableCell align="left">Date</TableCell>
                                                <TableCell align="left">Time</TableCell>
                                                {/* <TableCell align="left">stockOutDate</TableCell> */}
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {cashTransaction?.map((row, index) => (
                                                totalRowsCash !== 0 ?
                                                    <TableRow
                                                        key={row.paidBy + index}
                                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                        style={{ cursor: "pointer" }}
                                                        className='tableRow'
                                                    >
                                                        <TableCell align="left" >{(index + 1) + (page * rowsPerPage)}</TableCell>
                                                        <TableCell component="th" scope="row">
                                                            {row.paidBy}
                                                        </TableCell>
                                                        <TableCell align="left" >{row.receviedBy}</TableCell>
                                                        <TableCell align="left" >{row.paidAmount}</TableCell>
                                                        <TableCell align="left" >{row.transactionDate}</TableCell>
                                                        <TableCell align="left" >{row.transactionTime}</TableCell>
                                                        {/* <TableCell align="left" >{row.stockOutDate}</TableCell> */}
                                                    </TableRow> :
                                                    <TableRow
                                                        key={row.userId}
                                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                    >
                                                        <TableCell align="left" style={{ fontSize: "18px" }} >{"No Data Found...!"}</TableCell>
                                                    </TableRow>

                                            ))}
                                        </TableBody>
                                    </Table>
                                    <TablePagination
                                        rowsPerPageOptions={[5, 10, 25]}
                                        component="div"
                                        count={totalRowsCash}
                                        rowsPerPage={rowsPerPage}
                                        page={page}
                                        onPageChange={handleChangePage}
                                        onRowsPerPageChange={handleChangeRowsPerPage}
                                    />
                                </TableContainer>
                            </div>
                        }
                    </div>
                </div>
            </div>
        </div >
    )
}

export default TransactionTable;