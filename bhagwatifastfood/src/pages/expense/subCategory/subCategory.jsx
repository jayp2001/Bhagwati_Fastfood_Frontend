import './subCategory.css';
import { useState, useEffect } from "react";
import React from "react";
import { useRef } from 'react';
import { BACKEND_BASE_URL } from '../../../url';
import axios from 'axios';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TablePagination from '@mui/material/TablePagination';
// import Menutemp from './menu';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import { useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css';
import { DateRangePicker } from 'react-date-range';
import Popover from '@mui/material/Popover';
import { useNavigate } from "react-router-dom";
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import CloseIcon from '@mui/icons-material/Close';
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

function SubCategoryTable() {
    const { categoryId } = useParams()
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const [filter, setFilter] = React.useState(false);
    const id = open ? 'simple-popover' : undefined;
    const navigate = useNavigate();
    const [isEdit, setIsEdit] = React.useState(false);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [totalRows, setTotalRows] = React.useState(0);
    const [openModal, setOpen] = React.useState(false);
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    const [tab, setTab] = React.useState(1);
    const [categoryError, setCategoryError] = React.useState({
        subCategoryName: false
    });
    const [editCateory, setEditCategory] = React.useState({
        subCategoryName: '',
        subCategoryId: ''
    })
    const textFieldRef = useRef(null);
    const focus = () => {
        if (textFieldRef.current) {
            textFieldRef.current.focus();
        }
    };
    const [category, setCategory] = React.useState({
        categoryId: categoryId,
        subCategoryName: ''
    });

    const config = {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userInfo.token}`,
        },
    };
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(false);
    const [success, setSuccess] = React.useState(false);
    const [data, setData] = React.useState();
    const [state, setState] = useState([
        {
            startDate: new Date(),
            endDate: new Date(),
            key: 'selection'
        }
    ]);

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
    const handleReset = () => {
        setCategory('');
        setCategoryError(false);
        setEditCategory({
            subCategoryName: '',
            subCategoryId: ''
        });
        setIsEdit(false);
    }
    const addCategory = async () => {
        setLoading(true);
        await axios.post(`${BACKEND_BASE_URL}expenseAndBankrouter/addSubCategory`, category, config)
            .then((res) => {
                setSuccess(true)
                filter ? getDataByFilter() : getData();
                setPage(0);
                setRowsPerPage(5);
                setLoading(false);
                handleReset();
                focus();
            })
            .catch((error) => {
                setError(error.response && error.response.data ? error.response.data : "Network Error ...!!!");
            })
    }
    const submit = () => {
        if (loading || success) {

        } else {
            if (category.length < 2) {
                setError(
                    "Please Fill category"
                )
                setCategoryError(true);
            } else {
                addCategory()
            }
        }
    }
    const editCategory = async () => {
        if (loading || success) {

        } else {
            if (editCateory.subCategoryName.length < 2) {
                setError(
                    "Please Fill category"
                )
                setCategoryError(true);
            }
            else {
                setLoading(true);
                await axios.post(`${BACKEND_BASE_URL}expenseAndBankrouter/updateSubCategory`, editCateory, config)
                    .then((res) => {
                        setLoading(false);
                        setSuccess(true)
                        filter ? getDataByFilter() : getData();
                        setPage(0);
                        setIsEdit(false)
                        setRowsPerPage(5)
                        handleCloseModal()
                    })
                    .catch((error) => {
                        setError(error.response && error.response.data ? error.response.data : "Network Error ...!!!");
                    })
            }
        }
    }
    const getDataOnPageChange = async (pageNum, rowPerPageNum) => {
        console.log("page get", page, rowsPerPage)
        await axios.get(`${BACKEND_BASE_URL}expenseAndBankrouter/getSubCategoryListById?page=${pageNum}&numPerPage=${rowPerPageNum}&mainCategoryId=${categoryId}`, config)
            .then((res) => {
                setData(res.data.rows);
                setTotalRows(res.data.numRows);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const getDataOnPageChangeByFilter = async (pageNum, rowPerPageNum) => {
        console.log("page get", page, rowsPerPage)
        await axios.get(`${BACKEND_BASE_URL}expenseAndBankrouter/getSubCategoryListById?page=${pageNum}&numPerPage=${rowPerPageNum}&startDate=${state[0].startDate}&endDate=${state[0].endDate}&mainCategoryId=${categoryId}`, config)
            .then((res) => {
                setData(res.data.rows);
                setTotalRows(res.data.numRows);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
        if (filter) {
            getDataOnPageChangeByFilter(newPage + 1, rowsPerPage)
        }
        else {
            getDataOnPageChange(newPage + 1, rowsPerPage)
        }

    };
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
        if (filter) {
            getDataOnPageChangeByFilter(1, parseInt(event.target.value, 10))
        }
        else {
            getDataOnPageChange(1, parseInt(event.target.value, 10))
        }

    };
    const getDataByFilter = async () => {
        console.log("page get", page, rowsPerPage)
        await axios.get(`${BACKEND_BASE_URL}expenseAndBankrouter/getSubCategoryListById?page=${page + 1}&numPerPage=${rowsPerPage}&startDate=${state[0].startDate}&endDate=${state[0].endDate}&mainCategoryId=${categoryId}`, config)
            .then((res) => {
                setData(res.data.rows);
                setTotalRows(res.data.numRows);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const getData = async () => {
        console.log("page get", page, rowsPerPage)
        await axios.get(`${BACKEND_BASE_URL}expenseAndBankrouter/getSubCategoryListById?page=${page + 1}&numPerPage=${rowsPerPage}&mainCategoryId=${categoryId}`, config)
            .then((res) => {
                setData(res.data.rows);
                setTotalRows(res.data.numRows);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete Category?")) {
            deleteData(id);
            setTimeout(() => {
                setPage(0);
                setRowsPerPage(5);
                filter ? getDataByFilter() : getData();
            }, 50)
        }
    }
    const deleteData = async (id) => {
        setLoading(true)
        await axios.delete(`${BACKEND_BASE_URL}expenseAndBankrouter/removeSubCategory?subCategoryId=${id}`, config)
            .then((res) => {
                setLoading(false);
                setSuccess(true)
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const handleEdit = (id, name) => {
        setCategoryError(false);
        setIsEdit(true);
        setEditCategory((perv) => ({
            ...perv,
            subCategoryId: id,
            subCategoryName: name,
        }))
        setOpen(true)
    }
    useEffect(() => {
        getData();
    }, [])
    const navigateToDetail = (name, id) => {
        navigate(`/stockOutByCategory/${name}/${id}`);
    }
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
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
                position: "top-right",
                toastId: 'error',
                autoClose: 1500,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
            });
        setTimeout(() => {
            setSuccess(false)
            setLoading(false);
        }, 50)
    }
    if (error) {
        setLoading(false)
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
    const handleOpen = () => setOpen(true);
    return (
        <div className='productListContainer'>
            <div className='grid grid-cols-12'>
                <div className='col-span-12'>
                    <div className='productTableSubContainer'>
                        <div className='h-full grid grid-cols-12'>
                            <div className='h-full mobile:col-span-10  tablet1:col-span-10  tablet:col-span-7  laptop:col-span-7  desktop1:col-span-7  desktop2:col-span-7  desktop2:col-span-7 '>
                                <div className='grid grid-cols-12 pl-6 gap-3 h-full'>
                                    <div className={`flex col-span-3 justify-center ${tab === 1 || tab === '1' ? 'productTabAll' : 'productTab'}`} onClick={() => {
                                        setTab(1);
                                        // setPage(0); setRowsPerPage(5); getStockInData(); setFilter(false);
                                        // resetStockOutEdit();
                                        // setState([
                                        //     {
                                        //         startDate: new Date(),
                                        //         endDate: new Date(),
                                        //         key: 'selection'
                                        //     }
                                        // ])
                                    }}>
                                        <div className='statusTabtext'>Sub Catagories</div>
                                    </div>
                                    {/* <div className={`flex col-span-3 justify-center ${tab === 2 || tab === '2' ? 'productTabOut' : 'productTab'}`} onClick={() => {
                                        setTab(2);
                                        // setPage(0); setRowsPerPage(5); getStockOutData(); setFilter(false);
                                        // resetStockInEdit();
                                        // setState([
                                        //     {
                                        //         startDate: new Date(),
                                        //         endDate: new Date(),
                                        //         key: 'selection'
                                        //     }
                                        // ])
                                    }}>
                                        <div className='statusTabtext'>Stock-Out</div>
                                    </div>
                                    <div className={`flex col-span-3 justify-center ${tab === 3 || tab === '3' ? 'productTabIn' : 'productTab'}`} onClick={() => {
                                        setTab(3);
                                        // setStockOutData(); setPage(0); setRowsPerPage(5); setFilter(false);
                                        // setExpanded(false);
                                        // getStockOutEditdData();
                                        // setState([
                                        //     {
                                        //         startDate: new Date(),
                                        //         endDate: new Date(),
                                        //         key: 'selection'
                                        //     }
                                        // ])
                                    }}>
                                        <div className='statusTabtext'>Edited Stock-Out</div>
                                    </div> */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className='grid grid-cols-12 mt-6'>
                <div className='col-span-12'>
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
                                            {/* <TableCell align="right">Used Cost</TableCell>
                                            <TableCell align="right">Percentage</TableCell> */}
                                            <TableCell align="right"></TableCell>
                                            <TableCell align="right"></TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {data?.map((row, index) => (
                                            totalRows !== 0 ?
                                                <TableRow
                                                    hover
                                                    key={row.subCategoryId}
                                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                    style={{ cursor: "pointer" }}
                                                    className='tableRow'
                                                >
                                                    <TableCell align="left" >{(index + 1) + (page * rowsPerPage)}</TableCell>
                                                    <TableCell component="th" scope="row" >
                                                        {row.subCategoryName}
                                                    </TableCell>
                                                    {/* <TableCell align="right" >{parseFloat(row.outPrice ? row.outPrice : 0).toLocaleString('en-IN')}</TableCell>
                                                    <TableCell align="right" >{row.percentage}</TableCell> */}
                                                    <TableCell align="right" ><div className=''><button className='editCategoryBtn mr-6' onClick={() => handleEdit(row.subCategoryId, row.subCategoryName)}>Edit</button><button className='deleteCategoryBtn' onClick={() => handleDelete(row.subCategoryId)}>Delete</button></div></TableCell>
                                                    <TableCell align="right">
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
                        <div className='mt-6 grid grid-cols-12 gap-6'>
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
                                            subCategoryName: e.target.value
                                        })) : setCategory((perv) => ({
                                            ...perv,
                                            subCategoryName: e.target.value
                                        }))
                                    }}
                                    value={isEdit ? editCateory.subCategoryName ? editCateory.subCategoryName : '' : category.subCategoryName ? category.subCategoryName : ''}
                                    error={categoryError.subCategoryName ? true : false}
                                    inputRef={textFieldRef}
                                    helperText={categoryError.subCategoryName ? "Please Enter Category" : ''}
                                    name="subCategoryName"
                                    id="outlined-required"
                                    label="Category"
                                    InputProps={{ style: { fontSize: 17 } }}
                                    InputLabelProps={{ style: { fontSize: 17 } }}
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
                                        subCategoryId: '',
                                        subCategoryName: '',
                                    }));
                                    setCategory({
                                        categoryId: categoryId,
                                        subCategoryName: ''
                                    })
                                    setIsEdit(false)
                                }}>Cancle</button>
                            </div>
                        </div>
                    </Box>
                </Modal>
                <ToastContainer />
            </div >
        </div>
    )
}

export default SubCategoryTable;