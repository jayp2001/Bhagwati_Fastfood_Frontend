/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unreachable */
/* eslint-disable no-unused-vars */
// import './css/Dashboard.css';
import { useState, useEffect, useRef } from "react";
import React from 'react';
import './css/MenuCategory.css'
import { BACKEND_BASE_URL } from '../../url';
import { ToastContainer, toast } from 'react-toastify';
import Table from '@mui/material/Table';
import PropTypes from 'prop-types';
import Backdrop from '@mui/material/Backdrop';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import TextField from '@mui/material/TextField';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import { useSpring, animated } from '@react-spring/web';
import axios from 'axios';
import CheckIcon from '@mui/icons-material/Check';
const Fade = React.forwardRef(function Fade(props, ref) {
    const {
        children,
        in: open,
        onClick,
        onEnter,
        onExited,
        ownerState,
        ...other
    } = props;
    const style = useSpring({
        from: { opacity: 0 },
        to: { opacity: open ? 1 : 0 },
        onStart: () => {
            if (open && onEnter) {
                onEnter(null, true);
            }
        },
        onRest: () => {
            if (!open && onExited) {
                onExited(null, true);
            }
        },
    });

    return (
        <animated.div ref={ref} style={style} {...other}>
            {React.cloneElement(children, { onClick })}
        </animated.div>
    );
});

Fade.propTypes = {
    children: PropTypes.element.isRequired,
    in: PropTypes.bool,
    onClick: PropTypes.any,
    onEnter: PropTypes.func,
    onExited: PropTypes.func,
    ownerState: PropTypes.any,
};

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};
function MenuCategory() {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    const config = {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userInfo.token}`,
        },
    };
    useEffect(() => {
        getAllCategory();
    }, []);
    const getAllCategory = async () => {
        try {
            const response = await axios.get(`${BACKEND_BASE_URL}menuItemrouter/getMenuCategory`, config);
            setGetAllUnit(response.data)
        } catch (error) {
            setError(error?.response?.data || 'Network Error !!!...')
        }
    }


    const [tab, setTab] = React.useState(null);
    const [open, setOpen] = React.useState(false);
    const handleClose = () => {
        setOpen(false)
        setUnitEditPopUp(false)
        setFeildError(false)
    };
    const [getAllunit, setGetAllUnit] = React.useState();
    const [dataSearch, setDataSearch] = React.useState();
    const [searchWord, setSearchWord] = React.useState();
    const [suppiler, setSuppilerList] = React.useState();
    const [categories, setCategories] = React.useState();
    const [editIndex, setEditIndex] = React.useState(-1);
    const [countData, setCountData] = React.useState();
    const [addVariant, setAddVariant] = React.useState(false);
    const [variantFields, setVariantFields] = React.useState([]);
    const [unitName, setUnitName] = React.useState();
    const [loading, setLoading] = React.useState(false);
    const [updateCategory, setUpdateCategory] = React.useState(false)
    const [unitEditPopUp, setUnitEditPopUp] = useState(false)
    const [error, setError] = React.useState(false);
    const [success, setSuccess] = React.useState(false);
    const [updateIndex, setUpdateIndex] = useState('')
    const [feildError, setFeildError] = useState(false)
    const [menuNameData, setMenuNameData] = useState('')
    const [unitNameUpdate, setunitNameUpdate] = useState('')
    const autFocus = useRef(null)

    const handleOpen = () => { setOpen(true) };
    const addVariantFields = () => {
        setAddVariant(true);
        setVariantFields([...variantFields, { variantName: '', variantPrice: '', index: variantFields.length }]);
    }
    const removeVariantField = () => {
        setVariantFields(variantFields.filter((_, index) => index));
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
    const handleEdit = (name) => {
        setUnitEditPopUp(true)
        setMenuNameData(name)
        setunitNameUpdate(name.menuCategoryName);
    }
    const token = localStorage.getItem('token')

    const handleCreateCategory = async () => {
        if (!unitName) {
            setFeildError(true)
            setError('Unit Have to Be Filled')
            return;
        }
        else {
            setFeildError(false)
            try {
                const response = await axios.post(`${BACKEND_BASE_URL}menuItemrouter/addMenuCategory`, {
                    menuCategoryName: unitName
                }, config);
                if (response.data === 'Category Added Successfully') {
                    setUnitName('');
                    getAllCategory();
                    setSuccess('Category Added Successfully')
                    autFocus.current && autFocus.current.focus();
                }
            } catch (error) {
                if (error.response.data === "Unit is Already In Use") {
                    setError('Unit is Already In Use')
                    autFocus.current && autFocus.current.focus();
                }
                setError(error?.response?.data || 'Network Error !!!...')
            }
        }
    }
    const handleUpdateUnit = async (index) => {
        if (!unitNameUpdate) {
            setFeildError(true)
            setError('Unit Have to Be Filled')
            return;
        }
        const token = localStorage.getItem('token');
        try {
            const preUnitName = getAllunit[index];
            const response = await axios.post(`${BACKEND_BASE_URL}menuItemrouter/updateMenuCategory`, {
                menuCategoryId: preUnitName.menuCategoryId,
                menuCategoryName: unitNameUpdate
            }, config);
            if (response.data === 'Category Updated Successfully') {
                setSuccess('Category Updated Successfully')
                getAllCategory();
                handleClose();
            }
        } catch (error) {
            if (error.response.data === 'Unit is Same No Change') {
                setError('Unit is Same No Change')

            }
            setError(error?.response?.data || 'Network Error !!!...')
        }
    }
    const handleDeleteCategory = async (index) => {
        const token = localStorage.getItem('token');
        const password = '123'
        const enteredPassword = prompt('Please Enter The Password');
        if (enteredPassword !== password) {
            alert('Incorrect password. Operation aborted.');
            return;
        }

        if (enteredPassword === password) {
            try {
                const preUnitName = getAllunit[index];
                const response = await axios.delete(`${BACKEND_BASE_URL}menuItemrouter/removeMenuCategory?menuCategoryId=${preUnitName.menuCategoryId}`, config);
                if (response.data === 'Category Deleted Successfully') {
                    setSuccess('Category Deleted Successfully')
                    getAllCategory();
                    handleClose();
                }
            } catch (error) {
                setError(error?.response?.data || 'Network Error !!!...')
            }
        }
    }
    const [hoveredRow, setHoveredRow] = useState(null);
    const handleMouseEnter = (index) => {
        setHoveredRow(index);
    };

    const handleMouseLeave = () => {
        setHoveredRow(null);
    };


    return (
        <div className='BilingDashboardContainer mx-4 p-3 '>
            <div className='grid grid-cols-12 mt-5'>
                <div className='col-span-12'>
                    <div className='productTableSubContainer'>
                        <div className='h-full grid grid-cols-12'>
                            <div className='h-full mobile:col-span-10  tablet1:col-span-10  tablet:col-span-7  laptop:col-span-7  desktop1:col-span-7  desktop2:col-span-7  '>
                                <div className='grid grid-cols-12 pl-6 g h-full'>
                                    <div className={`flex col-span-3 justify-center ${tab === null || tab === '' || !tab ? 'productTabAll' : 'productTab'}`} onClick={() => { setTab(null); setSearchWord(''); setDataSearch([]) }}>
                                        <div className='statusTabtext'>Menu Categories</div>
                                    </div>
                                </div>
                            </div>
                            <div className=' grid col-span-2 col-start-11 pr-3  h-full'>
                                <div className='self-center justify-self-end'>
                                    <button className='addProductBtn' onClick={() => handleOpen()}>Add Menu</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ToastContainer />
            {!getAllunit == [] ? (
                <TableContainer className='bg-white px-4 pt-6 border-none rounded-xl mt-7'>
                    <Table component={Paper}>
                        <TableHead>
                            <TableRow>
                                <TableCell className=''>No.</TableCell>
                                <TableCell >Name</TableCell>
                                <TableCell className='pr-9' align='right' style={{ paddingRight: '36px' }}>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {getAllunit && getAllunit.map((categoryName, index) => (
                                <TableRow
                                    key={index}
                                    onMouseEnter={() => handleMouseEnter(index)}
                                    onMouseLeave={handleMouseLeave}
                                    style={{ backgroundColor: hoveredRow === index ? '#f5f5f5' : 'transparent', cursor: 'pointer' }}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell component="th" scope="row" style={{ maxWidth: '15px', width: '15px' }}>
                                        {index + 1}
                                    </TableCell>
                                    <TableCell component="th" scope="row"  >
                                        {categoryName.menuCategoryName}
                                    </TableCell>
                                    <TableCell component="th" scope="row" >
                                        <div className="flex w-100 justify-end">
                                            <div onClick={() => { handleEdit(categoryName); setUpdateIndex(index) }} className='rounded-lg border bg-gray-100 p-2 ml-4 cursor-pointer table_Actions_icon2 hover:bg-blue-600'>
                                                <BorderColorIcon className='text-gray-600 table_icon2' />
                                            </div>
                                            <div onClick={() => handleDeleteCategory(index)} className='rounded-lg bg-gray-100 p-2 ml-4 cursor-pointer table_Actions_icon2 hover:bg-red-600 border'>
                                                <DeleteOutlineOutlinedIcon className='text-gray-600 table_icon2 ' />
                                            </div>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            ) : (
                <div className="w-full flex justify-center">
                    <div className='text-center'>
                        <RestaurantMenuIcon className='restaurantMenu' />
                        <br />
                        <div className="text-2xl text-gray">
                            No Data Found
                        </div>
                    </div>
                </div>
            )}
            <div className="">
                {open && (
                    <Modal
                        aria-labelledby="spring-modal-title"
                        aria-describedby="spring-modal-description"
                        open={open}
                        onClose={handleClose}
                        closeAfterTransition
                        autoComplete="off"
                        slots={{ backdrop: Backdrop }}
                        slotProps={{
                            backdrop: {
                                TransitionComponent: Fade,
                            },
                        }}
                        className='w-full'
                    >
                        <Fade in={open}>
                            <Box sx={style}>
                                <div className="bg-white w-full">
                                    <div className="w-full mb-4 popHeading">
                                        Add Menu Category
                                    </div>
                                    <hr className='py-2 ' />
                                    <div className="flex mt-2 gap-4">
                                        <div className="w-2/5">
                                            <TextField
                                                onChange={(e) => {
                                                    setFeildError(false)
                                                    setUnitName(e.target.value)
                                                }}
                                                value={unitName}
                                                label="Category Name"
                                                variant="outlined"
                                                autoComplete="off"
                                                className="w-full col-span-3 mb-6 "
                                                error={feildError ? true : false}
                                                helperText={feildError ? 'Category name cannot be empty' : ''}
                                                inputRef={autFocus}
                                            />
                                        </div>
                                        <div className="w-1/4">
                                            <button onClick={handleCreateCategory} className="addCategorySaveBtn ml-4">Save</button>
                                        </div>
                                        <div className="w-1/4">
                                            <button onClick={() => {
                                                setOpen(false);
                                                setUnitName('')
                                                setFeildError(false)
                                            }} className="addCategoryCancleBtn ml-4 bg-gray-700">Cancel</button>
                                        </div>
                                    </div>
                                </div>
                            </Box>
                        </Fade>
                    </Modal>
                )}
            </div>
            <div className="">
                {unitEditPopUp && (
                    <Modal
                        aria-labelledby="spring-modal-title"
                        aria-describedby="spring-modal-description"
                        open={unitEditPopUp}
                        onClose={handleClose}
                        closeAfterTransition
                        slots={{ backdrop: Backdrop }}
                        slotProps={{
                            backdrop: {
                                TransitionComponent: Fade,
                            },
                        }}
                        className='w-full'
                    >
                        <Fade in={unitEditPopUp}>
                            <Box sx={style}>
                                <div className="bg-white w-full">
                                    <div className="w-full mb-4 popHeading">
                                        Edit Menu Category
                                    </div>
                                    <hr className='mb-4' />
                                    <div className="flex gap-4">
                                        <div className="w-2/5">
                                            <TextField
                                                onChange={(e) => {
                                                    setunitNameUpdate(e.target.value)
                                                    setFeildError(false)
                                                }}
                                                value={unitNameUpdate}
                                                label="Category Name"
                                                variant="outlined"
                                                className="w-full col-span-3 mb-6 "
                                                error={feildError ? true : false}
                                                helperText={feildError ? 'Category name cannot be empty' : ''}
                                                inputRef={autFocus}
                                                autoComplete="off"
                                            />
                                        </div>
                                        <div className="w-1/4">
                                            <button onClick={() => handleUpdateUnit(updateIndex)} className="addCategorySaveBtn ml-4">Save</button>
                                        </div>
                                        <div className="w-1/4">
                                            <button onClick={() => { setUnitEditPopUp(false); setFeildError(false) }} className="addCategoryCancleBtn ml-4 bg-gray-700">Cancel</button>
                                        </div>
                                    </div>
                                </div>
                            </Box>
                        </Fade>
                    </Modal>
                )}
            </div>
        </div>
    )
}

export default MenuCategory;