import './productList.css'
import dayjs from 'dayjs';
import { useState, useEffect } from "react";
import React from "react";
import { BACKEND_BASE_URL } from '../../../url';
import axios from 'axios';
import ProductCard from './component/productCard/productCard';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
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
const styleStockIn = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 800,
    bgcolor: 'background.paper',
    boxShadow: 24,
    paddingLeft: '20px',
    paddingRight: '20px',
    paddingTop: '15px',
    paddingBottom: '20px',
    borderRadius: '10px'
};
const qtyUnit = [
    'Kg',
    'Gm',
    'Ltr',
    'Mtr',
    'Pkts',
    'BOX',
    'ML',
    'Qty',
    'Piece',
    'Num'
]
function ProductList() {
    const [formData, setFormData] = React.useState({
        productName: '',
        productId: '',
        minProductQty: 0,
        minProductUnit: ''
    })
    const [stockInFormData, setStockInFormData] = React.useState({
        productId: "",
        productQty: 0,
        productUnit: "",
        productPrice: 0,
        totalPrice: 0,
        billNumber: "",
        supplierId: "",
        stockInPaymentMethod: 'cash',
        stockInComment: "",
        // stockInDate: null
        stockInDate: dayjs()
    })
    const [stockInFormDataError, setStockInFormDataError] = React.useState({
        productQty: false,
        productUnit: false,
        productPrice: false,
        totalPrice: false,
        supplierId: false,
        stockInPaymentMethod: false,
        stockInDate: false
    })
    const [stockInErrorFields, setStockInErrorFields] = React.useState([
        'productQty',
        'productUnit',
        'productPrice',
        'totalPrice',
        'supplierId',
        'stockInPaymentMethod',
        'stockInDate'
    ])
    const [stockOutFormData, setStockOutFormData] = React.useState({
        productId: "",
        productQty: 0,
        productUnit: "",
        stockOutCategory: 0,
        stockOutComment: "",
        stockOutDate: dayjs()
    })
    const [stockOutFormDataError, setStockOutFormDataError] = React.useState({
        productQty: false,
        productUnit: false,
        stockOutCategory: false,
        stockOutDate: false
    })
    const [stockOutErrorFields, setStockOutErrorFields] = React.useState([
        'productQty',
        'productUnit',
        'stockOutCategory',
        'stockOutDate',
    ])
    const [tab, setTab] = React.useState(null);
    const [isEdit, setIsEdit] = React.useState(false);
    const [formDataError, setFormDataError] = useState({
        productName: false,
        minProductQty: false,
        minProductUnit: false,
    })
    const [fields, setFields] = useState([
        'productName',
        'minProductQty',
        'minProductUnit',
    ])

    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    const config = {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userInfo.token}`,
        },
    };
    const [open, setOpen] = React.useState(false);
    const [openStockIn, setOpenStockIn] = React.useState(false);
    const [openStockOut, setOpenStockOut] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(false);
    const [data, setData] = React.useState();
    const [suppiler, setSuppilerList] = React.useState();
    const [categories, setCategories] = React.useState();
    const [countData, setCountData] = React.useState();
    const getSuppilerList = async (id) => {
        await axios.get(`${BACKEND_BASE_URL}inventoryrouter/productWiseSupplierDDL?productId=${id}`, config)
            .then((res) => {
                setSuppilerList(res.data);
            })
            .catch((error) => {
                setSuppilerList(['No Data'])
            })
    }
    const getCategoryList = async (id) => {
        await axios.get(`${BACKEND_BASE_URL}inventoryrouter/ddlStockOutCategory`, config)
            .then((res) => {
                setCategories(res.data);
            })
            .catch((error) => {
                setCategories(['No Data'])
            })
    }
    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }))
    }
    const onChangeStockIn = (e) => {
        if (e.target.name === 'productPrice' && stockInFormData.productQty > 0) {
            setStockInFormData((prevState) => ({
                ...prevState,
                productPrice: e.target.value,
                totalPrice: (parseFloat(e.target.value) * parseFloat(stockInFormData.productQty)).toString()

            }))
        } else if (e.target.name === 'totalPrice' && stockInFormData.productQty > 0) {
            setStockInFormData((prevState) => ({
                ...prevState,
                totalPrice: e.target.value,
                productPrice: (parseFloat(e.target.value) / parseFloat(stockInFormData.productQty)).toString()

            }))
        }
        else if (e.target.name === 'productQty' && stockInFormData.productPrice > 0) {
            setStockInFormData((prevState) => ({
                ...prevState,
                productQty: e.target.value,
                totalPrice: (parseFloat(e.target.value) * parseFloat(stockInFormData.productPrice)).toString()

            }))
        }
        else {
            setStockInFormData((prevState) => ({
                ...prevState,
                [e.target.name]: e.target.value,
            }))
        }
        console.log('formddds', stockInFormData)
    }
    const onChangeStockOut = (e) => {
        setStockOutFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }))
    }
    const handleOpen = () => setOpen(true);
    const handleOpenStockIn = (row) => {
        getSuppilerList(row.productId);

        setStockInFormData((perv) => ({
            ...perv,
            productId: row.productId,
            productName: row.productName,
            productUnit: row.minProductUnit
        }))
        setOpenStockIn(true);
    }
    const handleOpenStockOut = (row) => {
        getCategoryList();
        setStockOutFormData((perv) => ({
            ...perv,
            productId: row.productId,
            productName: row.productName,
            productUnit: row.minProductUnit
        }))
        setOpenStockOut(true);
    }
    const handleClose = () => {
        setOpen(false);
        // setCategory('');
        // setCategoryError(false);
        setFormData({
            stockOutCategoryName: '',
            stockOutCategoryId: ''
        });
        setIsEdit(false);
    }
    const handleCloseStockIn = () => {
        setStockInFormData({
            productId: "",
            productQty: 0,
            productUnit: "",
            productPrice: 0,
            totalPrice: 0,
            billNumber: "",
            supplierId: "",
            stockInPaymentMethod: 'cash',
            stockInComment: "",
            stockInDate: dayjs()
        })
        setStockInFormDataError({
            productQty: false,
            productUnit: false,
            productPrice: false,
            totalPrice: false,
            supplierId: false,
            stockInPaymentMethod: false,
            stockInDate: false
        })
        setOpenStockIn(false);
    }
    const handleStockInDate = (date) => {
        setStockInFormData((prevState) => ({
            ...prevState,
            ["stockInDate"]: date && date['$d'] ? date['$d'] : null,
        }))
    };

    const handleCloseStockOut = () => {
        setStockOutFormData({
            productId: "",
            productQty: 0,
            productUnit: "",
            stockOutCategory: 0,
            stockOutComment: "",
            stockOutDate: dayjs()
        })
        setStockOutFormDataError({
            productQty: false,
            productUnit: false,
            stockOutCategory: false,
            stockInDate: false
        })
        setOpenStockOut(false);
    }
    const handleStockOutDate = (date) => {
        setStockOutFormData((prevState) => ({
            ...prevState,
            ["stockOutDate"]: date && date['$d'] ? date['$d'] : null,
        }))
    };
    const getData = async () => {
        await axios.get(`${BACKEND_BASE_URL}inventoryrouter/getProductList?productStatus=${tab}`, config)
            .then((res) => {
                setData(res.data);
            })
            .catch((error) => {
                setError(error.response.data);
                setData(null)
            })
    }
    const getCountData = async () => {
        await axios.get(`${BACKEND_BASE_URL}inventoryrouter/getProductListCounter`, config)
            .then((res) => {
                setCountData(res.data);
            })
            .catch((error) => {
                alert(error.response.data)
            })
    }
    const deleteData = async (id) => {
        await axios.delete(`${BACKEND_BASE_URL}inventoryrouter/removeProduct?productId=${id}`, config)
            .then((res) => {
                alert("data deleted")
            })
            .catch((error) => {
                alert(error.response.data)
            })
    }
    useEffect(() => {
        getData();
        getCountData();
    }, [tab])
    const handleDeleteProduct = (id) => {
        if (window.confirm("Are you sure you want to delete Product?")) {
            deleteData(id);
            setTimeout(() => {
                setTab(null)
                getData()
                getCountData();
            }, 1000)
        }
    }
    const editCategory = async () => {
        await axios.post(`${BACKEND_BASE_URL}inventoryrouter/updateProduct`, formData, config)
            .then((res) => {
                alert("success");
                getData();
                handleClose()
            })
            .catch((error) => {
                alert(error.response.data);
            })

    }
    const addProduct = async () => {
        await axios.post(`${BACKEND_BASE_URL}inventoryrouter/addProduct`, formData, config)
            .then((res) => {
                alert("success");
                getData();
                setTab(null)
                getCountData();
                handleClose();
            })
            .catch((error) => {
                alert(error.response.data);
            })
    }
    const stockIn = async () => {
        await axios.post(`${BACKEND_BASE_URL}inventoryrouter/addStockInDetails`, stockInFormData, config)
            .then((res) => {
                alert("success");
                getData();
                setTab(null)
                getCountData();
                handleCloseStockIn();
            })
            .catch((error) => {
                alert(error.response.data);
            })
    }

    const stockOut = async () => {
        await axios.post(`${BACKEND_BASE_URL}inventoryrouter/addStockOutDetails`, stockOutFormData, config)
            .then((res) => {
                alert("success");
                getData();
                setTab(null)
                getCountData();
                handleCloseStockOut();
            })
            .catch((error) => {
                alert(error.response.data);
            })
    }

    const submitEdit = () => {
        const isValidate = fields.filter(element => {
            if (element === 'emailId') {
                return null
            } else if (formDataError[element] === true || formData[element] === '') {
                setFormDataError((perv) => ({
                    ...perv,
                    [element]: true
                }))
                return element;
            }
        })
        if (isValidate.length > 0) {
            alert(
                "Please Fill All Field"
            )
        } else {
            editCategory()
        }
    }
    const submitAdd = () => {
        const isValidate = fields.filter(element => {
            if (element === 'emailId') {
                return null
            } else if (formDataError[element] === true || formData[element] === '' || formData[element] === 0) {
                setFormDataError((perv) => ({
                    ...perv,
                    [element]: true
                }))
                return element;
            }
        })
        if (isValidate.length > 0) {
            alert(
                "Please Fill All Field"
            )
        } else {
            addProduct()
        }
    }


    const submitStockIn = () => {
        const isValidate = stockInErrorFields.filter(element => {
            if (element === 'stockInDate' && stockInFormData[element] === '' || stockInFormData[element] === null || stockInFormData.stockInDate == 'Invalid Date') {
                setStockInFormDataError((perv) => ({
                    ...perv,
                    [element]: true
                }))
                return element;
            }
            else if (stockInFormData[element] === true || stockInFormData[element] === '' || stockInFormData[element] === 0) {
                setStockInFormDataError((perv) => ({
                    ...perv,
                    [element]: true
                }))
                return element;
            }
        })
        if (isValidate.length > 0) {
            alert(
                "Please Fill All Field"
            )
        } else {
            // console.log(">>", stockInFormData, stockInFormData.stockInDate, stockInFormData.stockInDate != 'Invalid Date' ? 'ue' : 'false')
            stockIn()
        }
    }
    const submitStockOut = () => {
        const isValidate = stockOutErrorFields.filter(element => {
            if (element === 'stockOutDate' && stockOutFormData[element] === '' || stockOutFormData[element] === null || stockOutFormData.stockOutDate == 'Invalid Date') {
                setStockOutFormDataError((perv) => ({
                    ...perv,
                    [element]: true
                }))
                return element;
            }
            else if (stockOutFormData[element] === true || stockOutFormData[element] === '' || stockOutFormData[element] === 0) {
                setStockOutFormDataError((perv) => ({
                    ...perv,
                    [element]: true
                }))
                return element;
            }
        })
        if (isValidate.length > 0) {
            alert(
                "Please Fill All Field"
            )
        } else {
            // console.log(">>", stockInFormData, stockInFormData.stockInDate, stockInFormData.stockInDate != 'Invalid Date' ? 'ue' : 'false')
            stockOut()
        }
    }

    const handleEditClick = (row) => {
        setOpen(true);
        setIsEdit(true);
        setFormData({
            productName: row.productName,
            productId: row.productId,
            minProductQty: row.minProductQty,
            minProductUnit: row.minProductUnit
        })
    }

    if (data) {
    }
    return (
        <div className='productListContainer'>
            <div className='grid grid-cols-12'>
                <div className='col-span-12'>
                    <div className='productTableSubContainer'>
                        <div className='h-full grid grid-cols-12'>
                            <div className='h-full mobile:col-span-10  tablet1:col-span-10  tablet:col-span-7  laptop:col-span-7  desktop1:col-span-7  desktop2:col-span-7  desktop2:col-span-7 '>
                                <div className='grid grid-cols-12 pl-6 gap-3 h-full'>
                                    <div className={`flex col-span-3 justify-center ${tab === null || tab === '' || !tab ? 'productTabAll' : 'productTab'}`} onClick={() => setTab(null)}>
                                        <div className='statusTabtext'>All</div> &nbsp;&nbsp; <div className={`ProductCount ${tab === null || tab === '' || !tab ? 'blueCount' : ''}`}>{countData && countData.allProduct ? countData.allProduct : 0}</div>
                                    </div>
                                    <div className={`flex col-span-3 justify-center ${tab === 1 || tab === '1' ? 'productTabIn' : 'productTab'}`} onClick={() => setTab(1)}>
                                        <div className='statusTabtext'>In-Stock</div> &nbsp;&nbsp; <div className={`ProductCount ${tab === 1 || tab === '1' ? 'greenCount' : ''}`}>{countData && countData.instockProduct ? countData.instockProduct : 0}</div>
                                    </div>
                                    <div className={`flex col-span-3 justify-center ${tab === 2 || tab === '2' ? 'productTabUnder' : 'productTab'}`} onClick={() => setTab(2)}>
                                        <div className='statusTabtext'>Low-Stock</div> &nbsp;&nbsp; <div className={`ProductCount ${tab === 2 || tab === '2' ? 'orangeCount' : ''}`}>{countData && countData.underStockedProduct ? countData.underStockedProduct : 0}</div>
                                    </div>
                                    <div className={`flex col-span-3 justify-center ${tab === 3 || tab === '3' ? 'productTabOut' : 'productTab'}`} onClick={() => setTab(3)}>
                                        <div className='statusTabtext'>Out-Stock</div> &nbsp;&nbsp; <div className={`ProductCount ${tab === 3 || tab === '3' ? 'redCount' : ''}`}>{countData && countData.outOfStock ? countData.outOfStock : 0}</div>
                                    </div>
                                </div>
                            </div>
                            <div className=' grid col-span-2 col-start-11 pr-3 flex h-full'>
                                <div className='self-center justify-self-end'>
                                    <button className='addProductBtn' onClick={handleOpen}>Add Product</button>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
            <div className='productCardContainer mt-8 gap-6 grid mobile:grid-cols-2 tablet1:grid-cols-3 tablet:grid-cols-4 laptop:grid-cols-5 desktop1:grid-cols-6 desktop2:grid-cols-7 desktop2:grid-cols-8'>
                {
                    data ? data.map((product) => (
                        <ProductCard productData={product} handleOpenStockOut={handleOpenStockOut} handleOpenStockIn={handleOpenStockIn} handleDeleteProduct={handleDeleteProduct} handleEditClick={handleEditClick} />
                    ))
                        :
                        <div className='grid col-span-5 content-center'>
                            <div className='text-center noDataFoundText'>
                                {error ? error : 'No Data Found'}
                            </div>
                        </div>
                }
            </div>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        {isEdit ? 'Edit Product' : 'Add Product'}
                    </Typography>
                    <div className='mt-6 grid grid-cols-12 gap-6'>
                        <div className='col-span-6'>
                            <TextField
                                onBlur={(e) => {
                                    if (e.target.value.length < 2) {
                                        setFormDataError((perv) => ({
                                            ...perv,
                                            productName: true
                                        }))
                                    }
                                    else {
                                        setFormDataError((perv) => ({
                                            ...perv,
                                            productName: false
                                        }))
                                    }
                                }}
                                onChange={onChange}
                                value={formData.productName}
                                error={formDataError.productName}
                                helperText={formDataError.productName ? "Please Enter Product Name" : ''}
                                name="productName"
                                id="outlined-required"
                                label="Product Name"
                                InputProps={{ style: { fontSize: 14 } }}
                                InputLabelProps={{ style: { fontSize: 14 } }}
                                fullWidth
                            />
                        </div>
                        <div className='col-span-3'>
                            <TextField
                                onBlur={(e) => {
                                    if (e.target.value < 1) {
                                        setFormDataError((perv) => ({
                                            ...perv,
                                            minProductQty: true
                                        }))
                                    }
                                    else {
                                        setFormDataError((perv) => ({
                                            ...perv,
                                            minProductQty: false
                                        }))
                                    }
                                }}
                                type='number'
                                onChange={onChange}
                                value={formData.minProductQty}
                                error={formDataError.minProductQty}
                                helperText={formDataError.minProductQty ? "Enter Quantity" : ''}
                                name="minProductQty"
                                id="outlined-required"
                                label="Min Qty"
                                InputProps={{ style: { fontSize: 14 } }}
                                InputLabelProps={{ style: { fontSize: 14 } }}
                                fullWidth
                            />
                        </div>
                        <div className='col-span-3'>
                            <FormControl style={{ minWidth: '100%' }}>
                                <InputLabel id="demo-simple-select-label" required error={formDataError.minProductUnit}>Units</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={formData.minProductUnit}
                                    error={formDataError.minProductUnit}
                                    name="minProductUnit"
                                    label="Units"
                                    onBlur={(e) => {
                                        if (e.target.value.length < 2) {
                                            setFormDataError((perv) => ({
                                                ...perv,
                                                minProductUnit: true
                                            }))
                                        }
                                        else {
                                            setFormDataError((perv) => ({
                                                ...perv,
                                                minProductUnit: false
                                            }))
                                        }
                                    }}
                                    onChange={onChange}
                                >
                                    {
                                        qtyUnit ? qtyUnit.map((unit) => (
                                            <MenuItem key={unit} value={unit}>{unit}</MenuItem>
                                        )) : null
                                    }

                                </Select>
                            </FormControl>
                        </div>
                        <div className='col-span-3'>
                            <button className='addCategorySaveBtn' onClick={() => {
                                isEdit ? submitEdit() : submitAdd()
                            }}>{isEdit ? 'Save' : 'Add'}</button>
                        </div>
                        <div className='col-span-3'>
                            <button className='addCategoryCancleBtn' onClick={() => {
                                handleClose(); setFormData({
                                    productName: '',
                                    productId: '',
                                    minProductQty: 0,
                                    minProductUnit: ''
                                });
                                setFormDataError({
                                    productName: false,
                                    minProductQty: false,
                                    minProductUnit: false,
                                })
                                setIsEdit(false)
                            }}>Cancle</button>
                        </div>
                    </div>
                </Box>
            </Modal>
            <Modal
                open={openStockIn}
                onClose={handleCloseStockIn}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={styleStockIn}>
                    <Typography id="modal-modal" variant="h6" component="h2">
                        Stock In
                    </Typography>
                    <div className='mt-6 grid grid-cols-12 gap-6'>
                        <div className='col-span-3'>
                            <TextField
                                value={stockInFormData.productName}
                                name="productName"
                                id="outlined-required"
                                label="Product Name"
                                InputProps={{ style: { fontSize: 14 } }}
                                InputLabelProps={{ style: { fontSize: 14 } }}
                                fullWidth
                            />
                        </div>
                        <div className='col-span-3'>
                            <TextField
                                onBlur={(e) => {
                                    if (e.target.value < 1) {
                                        setStockInFormDataError((perv) => ({
                                            ...perv,
                                            productQty: true
                                        }))
                                    }
                                    else {
                                        setStockInFormDataError((perv) => ({
                                            ...perv,
                                            productQty: false
                                        }))
                                    }
                                }}
                                type="number"
                                label="Qty"
                                fullWidth
                                onChange={onChangeStockIn}
                                value={stockInFormData.productQty}
                                error={stockInFormDataError.productQty}
                                helperText={stockInFormDataError.productQty ? "Enter Product Qty" : ''}
                                name="productQty"
                                InputProps={{
                                    endAdornment: <InputAdornment position="end">{stockInFormData.productUnit}</InputAdornment>,
                                }}
                            />
                        </div>
                        <div className='col-span-3'>
                            <TextField
                                onBlur={(e) => {
                                    if (e.target.value < 1) {
                                        setStockInFormDataError((perv) => ({
                                            ...perv,
                                            productPrice: true
                                        }))
                                    }
                                    else {
                                        setStockInFormDataError((perv) => ({
                                            ...perv,
                                            productPrice: false
                                        }))
                                    }
                                }}
                                onChange={onChangeStockIn}
                                value={stockInFormData.productPrice === 'NaN' ? 0 : stockInFormData.productPrice}
                                error={stockInFormDataError.productPrice}
                                helperText={stockInFormDataError.productPrice ? "Enter Product Price" : ''}
                                name="productPrice"
                                id="outlined-required"
                                label="Product Price"
                                InputProps={{ style: { fontSize: 14 } }}
                                InputLabelProps={{ style: { fontSize: 14 } }}
                                fullWidth
                            />
                        </div>
                        <div className='col-span-3'>
                            <TextField
                                onBlur={(e) => {
                                    if (e.target.value < 1) {
                                        setStockInFormDataError((perv) => ({
                                            ...perv,
                                            totalPrice: true
                                        }))
                                    }
                                    else {
                                        setStockInFormDataError((perv) => ({
                                            ...perv,
                                            totalPrice: false
                                        }))
                                    }
                                }}
                                onChange={onChangeStockIn}
                                value={stockInFormData.totalPrice === 'NaN' ? 0 : stockInFormData.totalPrice}
                                error={stockInFormDataError.totalPrice}
                                helperText={stockInFormDataError.totalPrice ? "Enter Toatal Price" : ''}
                                name="totalPrice"
                                id="outlined-required"
                                label="Total Price"
                                InputProps={{ style: { fontSize: 14 } }}
                                InputLabelProps={{ style: { fontSize: 14 } }}
                                fullWidth
                            />
                        </div>
                    </div>
                    <div className='mt-4 grid grid-cols-12 gap-6'>
                        <div className='col-span-3'>
                            <TextField
                                onChange={onChangeStockIn}
                                value={stockInFormData.billNumber}
                                name="billNumber"
                                id="outlined-required"
                                label="Bill Number"
                                InputProps={{ style: { fontSize: 14 } }}
                                InputLabelProps={{ style: { fontSize: 14 } }}
                                fullWidth
                            />
                        </div>
                        <div className='col-span-4'>
                            <FormControl style={{ minWidth: '100%', maxWidth: '100%' }}>
                                <InputLabel id="demo-simple-select-label" required error={stockInFormDataError.supplierId}>Suppiler</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={stockInFormData.supplierId}
                                    error={stockInFormDataError.supplierId}
                                    name="supplierId"
                                    label="Suppiler"
                                    onBlur={(e) => {
                                        if (e.target.value.length < 2) {
                                            setStockInFormDataError((perv) => ({
                                                ...perv,
                                                supplierId: true
                                            }))
                                        }
                                        else {
                                            setStockInFormDataError((perv) => ({
                                                ...perv,
                                                supplierId: false
                                            }))
                                        }
                                    }}
                                    onChange={onChangeStockIn}
                                >
                                    {
                                        suppiler ? suppiler.map((suppilerData) => (
                                            <MenuItem key={suppilerData.supplierId} value={suppilerData.supplierId}>{suppilerData.supplierNickName}</MenuItem>
                                        )) : null
                                    }

                                </Select>
                            </FormControl>
                        </div>
                        <div className='col-span-2'>
                            <FormControl style={{ minWidth: '100%', maxWidth: '100%' }}>
                                <InputLabel id="demo-simple-select-label" error={stockInFormDataError.stockInPaymentMethod}>Payment</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={stockInFormData.stockInPaymentMethod}
                                    error={stockInFormDataError.stockInPaymentMethod}
                                    name="stockInPaymentMethod"
                                    label="Payment"
                                    onBlur={(e) => {
                                        if (e.target.value.length < 2) {
                                            setStockInFormDataError((perv) => ({
                                                ...perv,
                                                stockInPaymentMethod: true
                                            }))
                                        }
                                        else {
                                            setStockInFormDataError((perv) => ({
                                                ...perv,
                                                stockInPaymentMethod: false
                                            }))
                                        }
                                    }}
                                    onChange={onChangeStockIn}
                                >
                                    <MenuItem key={'cash'} value={'cash'}>{'Cash'}</MenuItem>
                                    <MenuItem key={'debit'} value={'debit'}>{'Debit'}</MenuItem>
                                </Select>
                            </FormControl>
                        </div>
                        <div className='col-span-3'>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DesktopDatePicker
                                    textFieldStyle={{ width: '100%' }}
                                    InputProps={{ style: { fontSize: 14, width: '100%' } }}
                                    InputLabelProps={{ style: { fontSize: 14 } }}
                                    label="Stock In Date"
                                    format="DD/MM/YYYY"
                                    required
                                    error={stockInFormDataError.stockInDate}
                                    value={stockInFormData.stockInDate}
                                    onChange={handleStockInDate}
                                    name="stockInDate"
                                    renderInput={(params) => <TextField {...params} sx={{ width: '100%' }} />}
                                />
                            </LocalizationProvider>
                        </div>
                    </div>
                    <div className='mt-4 grid grid-cols-12 gap-6'>
                        <div className='col-span-12'>
                            <TextField
                                onChange={onChangeStockIn}
                                value={stockInFormData.stockInComment}
                                name="stockInComment"
                                id="outlined-required"
                                label="Comment"
                                InputProps={{ style: { fontSize: 14 } }}
                                InputLabelProps={{ style: { fontSize: 14 } }}
                                fullWidth
                            />
                        </div>
                    </div>
                    <div className='mt-4 grid grid-cols-12 gap-6'>
                        <div className='col-span-3'>
                            <button className='addCategorySaveBtn' onClick={() => {
                                submitStockIn()
                            }}>Stock In</button>
                        </div>
                        <div className='col-span-3'>
                            <button className='addCategoryCancleBtn' onClick={() => {
                                handleCloseStockIn();
                            }}>Cancle</button>
                        </div>
                    </div>
                </Box>
            </Modal>
            <Modal
                open={openStockOut}
                onClose={handleCloseStockOut}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={styleStockIn}>
                    <Typography id="modal-modal" variant="h6" component="h2">
                        Stock Out
                    </Typography>
                    <div className='mt-6 grid grid-cols-12 gap-6'>
                        <div className='col-span-3'>
                            <TextField
                                value={stockOutFormData.productName}
                                name="productName"
                                id="outlined-required"
                                label="Product Name"
                                InputProps={{ style: { fontSize: 14 } }}
                                InputLabelProps={{ style: { fontSize: 14 } }}
                                fullWidth
                            />
                        </div>
                        <div className='col-span-3'>
                            <TextField
                                onBlur={(e) => {
                                    if (e.target.value < 1) {
                                        setStockOutFormDataError((perv) => ({
                                            ...perv,
                                            productQty: true
                                        }))
                                    }
                                    else {
                                        setStockOutFormDataError((perv) => ({
                                            ...perv,
                                            productQty: false
                                        }))
                                    }
                                }}
                                type="number"
                                label="Qty"
                                fullWidth
                                onChange={onChangeStockOut}
                                value={stockOutFormData.productQty}
                                error={stockOutFormDataError.productQty}
                                helperText={stockOutFormDataError.productQty ? "Enter Product Qty" : ''}
                                name="productQty"
                                InputProps={{
                                    endAdornment: <InputAdornment position="end">{stockOutFormData.productUnit}</InputAdornment>,
                                }}
                            />
                        </div>
                        <div className='col-span-3'>
                            <FormControl style={{ minWidth: '100%', maxWidth: '100%' }}>
                                <InputLabel id="demo-simple-select-label" required error={stockOutFormDataError.stockOutCategory}>Category</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={stockOutFormData.stockOutCategory}
                                    error={stockOutFormDataError.stockOutCategory}
                                    name="stockOutCategory"
                                    label="Category"
                                    onBlur={(e) => {
                                        if (e.target.value.length < 2) {
                                            setStockOutFormDataError((perv) => ({
                                                ...perv,
                                                stockOutCategory: true
                                            }))
                                        }
                                        else {
                                            setStockOutFormDataError((perv) => ({
                                                ...perv,
                                                stockOutCategory: false
                                            }))
                                        }
                                    }}
                                    onChange={onChangeStockOut}
                                >
                                    {
                                        categories ? categories.map((category) => (
                                            <MenuItem key={category.stockOutCategoryId} value={category.stockOutCategoryId}>{category.stockOutCategoryName}</MenuItem>
                                        )) : null
                                    }

                                </Select>
                            </FormControl>
                        </div>
                        <div className='col-span-3'>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DesktopDatePicker
                                    textFieldStyle={{ width: '100%' }}
                                    InputProps={{ style: { fontSize: 14, width: '100%' } }}
                                    InputLabelProps={{ style: { fontSize: 14 } }}
                                    label="Stock In Date"
                                    format="DD/MM/YYYY"
                                    required
                                    error={stockOutFormDataError.stockOutDate}
                                    value={stockOutFormData.stockOutDate}
                                    onChange={handleStockOutDate}
                                    name="stockOutDate"
                                    renderInput={(params) => <TextField {...params} sx={{ width: '100%' }} />}
                                />
                            </LocalizationProvider>
                        </div>
                    </div>
                    <div className='mt-4 grid grid-cols-12 gap-6'>
                        <div className='col-span-12'>
                            <TextField
                                onChange={onChangeStockOut}
                                value={stockOutFormData.stockOutComment}
                                name="stockOutComment"
                                id="outlined-required"
                                label="Comment"
                                InputProps={{ style: { fontSize: 14 } }}
                                InputLabelProps={{ style: { fontSize: 14 } }}
                                fullWidth
                            />
                        </div>
                    </div>
                    <div className='mt-4 grid grid-cols-12 gap-6'>
                        <div className='col-span-3'>
                            <button className='addCategorySaveBtn' onClick={() => {
                                submitStockOut()
                            }}>Stock Out</button>
                        </div>
                        <div className='col-span-3'>
                            <button className='addCategoryCancleBtn' onClick={() => {
                                handleCloseStockOut();
                            }}>Cancle</button>
                        </div>
                    </div>
                </Box>
            </Modal>
        </div>
    )
}

export default ProductList;