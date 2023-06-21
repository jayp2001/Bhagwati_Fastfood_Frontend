import './addSuppiler.css'
import { useState, useEffect } from "react";
import React from "react";
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
import OutlinedInput from '@mui/material/OutlinedInput';
import { BACKEND_BASE_URL } from '../../../url';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import axios from 'axios';
import { useTheme } from '@mui/material/styles';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

function getStyles(name, personName, theme) {
    return {
        fontWeight:
            personName.indexOf(name) === -1
                ? theme.typography.fontWeightRegular
                : theme.typography.fontWeightMedium,
    };
}
function AddSuppiler() {
    const theme = useTheme();
    const regex = /^[0-9\b]+$/;
    const emailRegx = /^[a-zA-Z0-9_\.\+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-\.]+$/;
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    const config = {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userInfo.token}`,
        },
    };
    const [productName, setProductName] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(false);
    const [success, setSuccess] = React.useState(false);
    const [productList, setProductList] = useState();
    const [formData, setFormData] = useState({
        supplierFirstName: '',
        supplierNickName: '',
        supplierLastName: '',
        supplierFirmName: '',
        supplierFirmAddress: '',
        supplierPhoneNumber: '',
        supplierEmailId: '',
        productId: []
    });
    const [formDataError, setFormDataError] = useState({
        supplierFirstName: false,
        supplierLastName: false,
        supplierFirmName: false,
        supplierFirmAddress: false,
        supplierPhoneNumber: false,
        supplierEmailId: false,
        productId: false
    })
    const handleChange = (event) => {
        const {
            target: { value },
        } = event;
        const products = productList.map((obj) => {
            if (value.includes(obj.productName)) {
                return obj.productId;
            } else {
                return null;
            }
        });
        var res = products.filter(elements => {
            return (elements != null && elements !== undefined && elements !== "");
        });
        console.log("res", res)
        setProductName(
            // On autofill we get a stringified value.
            typeof value === 'string' ? value.split(',') : value,
        );
        setFormData((pervState) => ({
            ...pervState,
            productId: res,
        }))
        console.log('array', typeof value === 'string' ? value.split(',') : value)
    };
    const [fields, setFields] = useState([
        'supplierFirstName',
        'supplierLastName',
        'supplierFirmName',
        'supplierFirmAddress',
        'supplierPhoneNumber',
        'supplierEmailId',
        'productId',
    ])

    const getProductList = async () => {
        await axios.get(`${BACKEND_BASE_URL}inventoryrouter/ddlProduct`, config)
            .then((res) => {
                setProductList(res.data);
            })
    }

    useEffect(() => {
        getProductList();
    }, [])

    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }))
    }
    const reset = () => {
        setFormData({
            supplierFirstName: '',
            supplierNickName: '',
            supplierLastName: '',
            supplierFirmName: '',
            supplierFirmAddress: '',
            supplierPhoneNumber: '',
            supplierEmailId: '',
            productId: []
        });
        setProductName([]);
    }
    const addSuppiler = async () => {
        setLoading(true);
        await axios.post(`${BACKEND_BASE_URL}inventoryrouter/addSupplierDetails`, formData, config)
            .then((res) => {
                setLoading(false);
                setSuccess(true);
                alert("success");
                reset();
            })
            .catch((error) => {
                setLoading(false);
                setError(error.response.data);
                alert(error.response.data);
            })
    }
    const submit = () => {
        console.log('>>>>>>>>>>', formData)

        const isValidate = fields.filter(element => {
            if (element === 'supplierEmailId') {
                return null
            } else if (element === 'productId') {
                if (formDataError[element] === true || formData[element] === []) {
                    setFormDataError((perv) => ({
                        ...perv,
                        [element]: true
                    }))
                    return element;
                }
            } else if (formDataError[element] === true || formData[element] === '') {
                setFormDataError((perv) => ({
                    ...perv,
                    [element]: true
                }))
                return element;
            }
        })
        console.log('????', isValidate);
        if (isValidate.length > 0) {
            alert(
                "Please Fill All Field"
            )
        } else {
            addSuppiler()
            // console.log('submit', formData);
        }
    }

    // if (loading) {
    //     console.log('>>>>??')
    //     toast.loading("Please wait...", {
    //         toastId: 'loading'
    //     })
    //     // window.alert()
    // }
    // if (success) {
    //     toast.dismiss('loading');
    //     toast.dismiss('error');
    //     toast('success',
    //         {
    //             type: 'success',
    //             toastId: 'success',
    //             position: "bottom-right",
    //             toastId: 'error',
    //             autoClose: 3000,
    //             hideProgressBar: false,
    //             closeOnClick: true,
    //             pauseOnHover: true,
    //             draggable: true,
    //             progress: undefined,
    //             theme: "colored",
    //         });

    //     setSuccess(false)
    //     setTimeout(() => {
    //         reset()
    //     }, 50)
    // }
    // if (error) {
    //     toast.dismiss('loading');
    //     toast(error, {
    //         type: 'error',
    //         position: "bottom-right",
    //         toastId: 'error',
    //         autoClose: 3000,
    //         hideProgressBar: false,
    //         closeOnClick: true,
    //         pauseOnHover: true,
    //         draggable: true,
    //         progress: undefined,
    //         theme: "colored",
    //     });
    //     setError(false);
    // }


    return (
        <div className='mainBodyAddSuppiler grid content-center'>
            <div className="grid grid-cols-12">
                <div className="col-span-8 col-start-3">
                    <div className="addSuppilerCard">
                        <div className="header flex items-center ">
                            <div className="grid justify-items-center w-full">
                                <div className="header_text">
                                    Add Suppiler
                                </div>
                            </div>
                        </div>
                        <div className='addUserTextFieldWrp'>
                            <div className='grid grid-rows-3 gap-6'>
                                <div className='grid grid-cols-12 gap-6'>
                                    <div className="col-span-4">
                                        <TextField
                                            onBlur={(e) => {
                                                if (e.target.value.length < 2) {
                                                    setFormDataError((perv) => ({
                                                        ...perv,
                                                        supplierFirstName: true
                                                    }))
                                                }
                                                else {
                                                    setFormDataError((perv) => ({
                                                        ...perv,
                                                        supplierFirstName: false
                                                    }))
                                                }
                                            }}
                                            onChange={onChange}
                                            value={formData.supplierFirstName}
                                            error={formDataError.supplierFirstName}
                                            helperText={formDataError.supplierFirstName ? "Please Enter First Name" : ''}
                                            name="supplierFirstName"
                                            id="outlined-required"
                                            label="Suppiler First Name"
                                            InputProps={{ style: { fontSize: 14 } }}
                                            InputLabelProps={{ style: { fontSize: 14 } }}
                                            fullWidth
                                        />
                                    </div>
                                    <div className="col-span-4">
                                        <TextField
                                            onBlur={(e) => {
                                                if (e.target.value.length < 2) {
                                                    setFormDataError((perv) => ({
                                                        ...perv,
                                                        supplierLastName: true
                                                    }))
                                                }
                                                else {
                                                    setFormDataError((perv) => ({
                                                        ...perv,
                                                        supplierLastName: false
                                                    }))
                                                }
                                            }}
                                            onChange={onChange}
                                            value={formData.supplierLastName}
                                            error={formDataError.supplierLastName}
                                            helperText={formDataError.supplierLastName ? "Please Enter Last Name" : ''}
                                            name="supplierLastName"
                                            id="outlined-required"
                                            label="Supplier Last Name"
                                            InputProps={{ style: { fontSize: 14 } }}
                                            InputLabelProps={{ style: { fontSize: 14 } }}
                                            fullWidth
                                        />
                                    </div>
                                    <div className='col-span-4'>
                                        <TextField
                                            onBlur={(e) => {
                                                if (e.target.value.length < 2) {
                                                    setFormDataError((perv) => ({
                                                        ...perv,
                                                        supplierFirmName: true
                                                    }))
                                                }
                                                else {
                                                    setFormDataError((perv) => ({
                                                        ...perv,
                                                        supplierFirmName: false
                                                    }))
                                                }
                                            }}
                                            onChange={onChange}
                                            value={formData.supplierFirmName}
                                            error={formDataError.supplierFirmName}
                                            helperText={formDataError.supplierFirmName ? "Please Enter Supplier Firm Name" : ''}
                                            name="supplierFirmName"
                                            id="outlined-required"
                                            label="Supplier Firm Name"
                                            InputProps={{ style: { fontSize: 14 } }}
                                            InputLabelProps={{ style: { fontSize: 14 } }}
                                            fullWidth
                                        />
                                    </div>
                                </div>
                                <div className='grid grid-cols-12 gap-6'>
                                    <div className="col-span-4">
                                        <TextField
                                            onBlur={(e) => {
                                                if (e.target.value.length < 2) {
                                                    setFormDataError((perv) => ({
                                                        ...perv,
                                                        supplierNickName: true
                                                    }))
                                                }
                                                else {
                                                    setFormDataError((perv) => ({
                                                        ...perv,
                                                        supplierNickName: false
                                                    }))
                                                }
                                            }}
                                            onChange={onChange}
                                            value={formData.supplierNickName}
                                            // error={formDataError.supplierNickName}
                                            // helperText={formDataError.supplierNickName ? "Please Enter Last Name" : ''}
                                            name="supplierNickName"
                                            id="outlined-required"
                                            label="Supplier Nick Name"
                                            InputProps={{ style: { fontSize: 14 } }}
                                            InputLabelProps={{ style: { fontSize: 14 } }}
                                            fullWidth
                                        />
                                    </div>
                                    <div className="col-span-4">
                                        <TextField
                                            onBlur={(e) => {
                                                if (emailRegx.test(e.target.value) || e.target.value === '') {
                                                    setFormDataError((perv) => ({
                                                        ...perv,
                                                        supplierEmailId: false
                                                    }))
                                                }
                                                else {
                                                    setFormDataError((perv) => ({
                                                        ...perv,
                                                        supplierEmailId: true
                                                    }))
                                                }
                                            }}
                                            error={formDataError.supplierEmailId}
                                            helperText={formDataError.supplierEmailId ? "Please Enter valid Email" : ''}
                                            onChange={onChange}
                                            value={formData.supplierEmailId}
                                            name="supplierEmailId"
                                            id="outlined-required"
                                            label="Supplier Email Id"
                                            InputProps={{ style: { fontSize: 14 } }}
                                            InputLabelProps={{ style: { fontSize: 14 } }}
                                            fullWidth
                                        />
                                    </div>
                                    <div className="col-span-4">
                                        <TextField
                                            onBlur={(e) => {
                                                if (e.target.value.length < 10) {
                                                    setFormDataError((perv) => ({
                                                        ...perv,
                                                        supplierPhoneNumber: true
                                                    }))
                                                }
                                                else {
                                                    setFormDataError((perv) => ({
                                                        ...perv,
                                                        supplierPhoneNumber: false
                                                    }))
                                                }
                                            }}
                                            onChange={(e) => {
                                                if ((regex.test(e.target.value) || e.target.value === '') && e.target.value.length < 11) {
                                                    onChange(e)
                                                }
                                            }}
                                            value={formData.supplierPhoneNumber}
                                            error={formDataError.supplierPhoneNumber}
                                            helperText={formDataError.supplierPhoneNumber ? "Please Enter WhatsApp Number" : ''}
                                            name="supplierPhoneNumber"
                                            id="outlined-required"
                                            label="Mobile Number"
                                            InputProps={{ style: { fontSize: 14 } }}
                                            InputLabelProps={{ style: { fontSize: 14 } }}
                                            fullWidth
                                        />
                                    </div>
                                </div>
                                <div className='grid grid-cols-12 gap-6'>
                                    <div className="col-span-12">
                                        <TextField
                                            onBlur={(e) => {
                                                if (e.target.value.length < 2) {
                                                    setFormDataError((perv) => ({
                                                        ...perv,
                                                        supplierFirmAddress: true
                                                    }))
                                                }
                                                else {
                                                    setFormDataError((perv) => ({
                                                        ...perv,
                                                        supplierFirmAddress: false
                                                    }))
                                                }
                                            }}
                                            onChange={onChange}
                                            value={formData.supplierFirmAddress}
                                            error={formDataError.supplierFirmAddress}
                                            helperText={formDataError.supplierFirmAddress ? "Please Enter Firm address" : ''}
                                            name="supplierFirmAddress"
                                            id="outlined-required"
                                            label="Supplier Firm Address"
                                            InputProps={{ style: { fontSize: 14 } }}
                                            InputLabelProps={{ style: { fontSize: 14 } }}
                                            fullWidth
                                        />
                                    </div>
                                </div>
                                <div className='grid grid-cols-12 gap-6'>
                                    <div className="col-span-12">
                                        {/* <FormControl style={{ minWidth: '100%' }}>
                                            <InputLabel id="demo-simple-select-label" required error={formDataError.userRights}>User Role</InputLabel>
                                            <Select
                                                onBlur={(e) => {
                                                    if (e.target.value.length < 2) {
                                                        setFormDataError((perv) => ({
                                                            ...perv,
                                                            userRights: true
                                                        }))
                                                    }
                                                    else {
                                                        setFormDataError((perv) => ({
                                                            ...perv,
                                                            userRights: false
                                                        }))
                                                    }
                                                }}
                                                labelId="demo-simple-select-label"
                                                id="demo-simple-select"
                                                value={formData.userRights}
                                                error={formDataError.userRights}
                                                name="userRights"
                                                label="User Role"
                                                onChange={onChange}
                                            >
                                                {
                                                    rights ? rights.map((right) => (
                                                        <MenuItem key={right.rightsId} value={right.rightsId}>{right.rightsName}</MenuItem>
                                                    )) : null
                                                }

                                            </Select>
                                        </FormControl> */}
                                        {/* labelId="demo-multiple-chip-label"
                                        id="demo-multiple-chip"
                                        multiple
                                        value={productName}
                                        onChange={handleChange}
                                        input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
                                        renderValue={(selected) => (
                                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                {selected.map((value) => (
                                                    <Chip key={value} label={value} />
                                                ))}
                                            </Box>
                                        )}
                                        MenuProps={MenuProps} */}
                                        <FormControl style={{ minWidth: '100%' }}>
                                            <InputLabel id="demo-multiple-chip-label">Products</InputLabel>
                                            <Select
                                                multiple
                                                labelId="demo-simple-select-label"
                                                id="demo-simple-select"
                                                value={productName}
                                                error={formDataError.productId}
                                                name="productId"
                                                label="Products"
                                                onChange={handleChange}
                                                input={<OutlinedInput id="demo-simple-select" label="Products" />}
                                                renderValue={(selected) => (
                                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                        {selected.map((value) => (
                                                            <Chip key={value} label={value} />
                                                        ))}
                                                    </Box>
                                                )}
                                                MenuProps={MenuProps}
                                            >
                                                {productList ? productList.map((product) => (
                                                    <MenuItem
                                                        key={product.productId}
                                                        value={product.productName}
                                                        style={getStyles(product.productName, productName, theme)}
                                                    >
                                                        {product.productName}
                                                    </MenuItem>
                                                )) : null}
                                            </Select>
                                        </FormControl>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='addUserBtnContainer grid grid-rows-1'>
                            <div className='grid grid-cols-12 gap-6'>
                                <div className='col-start-4 col-span-3'>
                                    <button onClick={() => submit()} className='saveBtn' >Save</button>
                                </div>
                                <div className='col-span-3'>
                                    <button onClick={() => reset()} className='resetBtn'>reset</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AddSuppiler;