import './productList.css'
import { useState, useEffect } from "react";
import React from "react";
import { BACKEND_BASE_URL } from '../../../url';
import axios from 'axios';
// import Table from '@mui/material/Table';
// import TableBody from '@mui/material/TableBody';
// import TableCell from '@mui/material/TableCell';
// import TableContainer from '@mui/material/TableContainer';
// import TableHead from '@mui/material/TableHead';
// import TableRow from '@mui/material/TableRow';
// import Paper from '@mui/material/Paper';
// import TablePagination from '@mui/material/TablePagination';
// import Menutemp from './menu';
import ProductCard from './component/productCard/productCard';

function ProductList() {
    // const [page, setPage] = React.useState(0);
    // const [rowsPerPage, setRowsPerPage] = React.useState(5);
    // const [totalRows, setTotalRows] = React.useState(0);
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    const config = {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userInfo.token}`,
        },
    };
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(false);
    const [data, setData] = React.useState();
    const getData = async () => {
        await axios.get(`${BACKEND_BASE_URL}inventoryrouter/getProductList`, config)
            .then((res) => {
                setData(res.data);
            })
            .catch((error) => {
                alert(error.response.data)
            })
    }
    // const getDataOnPageChange = async (pageNum, rowPerPageNum) => {
    //     console.log("page get", page, rowsPerPage)
    //     await axios.get(`${BACKEND_BASE_URL}inventoryrouter/getSupplierdata?page=${pageNum}&numPerPage=${rowPerPageNum}`, config)
    //         .then((res) => {
    //             setData(res.data.rows);
    //             setTotalRows(res.data.numRows);
    //         })
    //         .catch((error) => {
    //             alert(error.response.data)
    //         })
    // }
    // const deleteData = async (id) => {
    //     await axios.delete(`${BACKEND_BASE_URL}inventoryrouter/removeSupplierDetails?supplierId=${id}`, config)
    //         .then((res) => {
    //             alert("data deleted")
    //         })
    //         .catch((error) => {
    //             alert(error.response.data)
    //         })
    // }
    useEffect(() => {
        getData();
    }, [])
    // const handleDeleteSuppiler = (id) => {
    //     if (window.confirm("Are you sure you want to delete User?")) {
    //         deleteData(id);
    //         setTimeout(() => {
    //             getData()
    //         }, 1000)
    //     }
    // }
    if (data) {
        console.log('products', data)
    }
    return (
        // <div className='productListContainer'>

        //     <div className='grid grid-cols-6'>
        //         <ProductCard />
        //     </div>
        // </div>
        <div className='productListContainer'>
            <div className='grid grid-cols-12'>
                <div className='col-span-12'>
                    <div className='userTableSubContainer'>
                        <div className='flex justify-center w-full'>
                            <div className='tableHeader flex justify-between'>
                                <div>
                                    Product List
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className='productCardContainer mt-8 gap-6 grid grid-cols-5'>
                {
                    data && data.map((product) => (
                        <ProductCard productData={product} />
                    ))
                }
            </div>
        </div>
    )
}

export default ProductList;