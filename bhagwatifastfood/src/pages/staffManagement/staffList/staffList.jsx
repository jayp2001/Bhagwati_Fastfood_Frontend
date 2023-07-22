import './staffList.css';
import CountCard from '../../inventory/countCard/countCard'
import EmployeeCard from '../employeeCard/employeeCard';
import { useState, useEffect } from "react";
import React from "react";
import { useRef } from 'react';
import { BACKEND_BASE_URL } from '../../../url';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';

function StaffList() {
    const [category, setCategory] = useState('');
    const [activeCategory, setActiveCategory] = useState('');
    const [employeeList, setEmployeeList] = useState('');
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    const config = {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userInfo.token}`,
        },
    };
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(false);
    const [success, setSuccess] = React.useState(false);


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

    useEffect(() => {
        getEmployeeList('');
        getCategory();
    }, [])

    return (
        <div className='mainBody flex gap-4 pr-4 pl-4'>
            <div className='categoryListContainer'>
                <div className='categoryHeader'>
                    Categories
                    <hr className="hr"></hr>
                </div>
                <div className='categoryListWrp'>
                    <div className={activeCategory === '' ? 'active' : 'navLink'} onClick={() => setActiveCategory('')}>
                        All
                    </div>
                    <div className={activeCategory === 'pay' ? 'active' : 'navLink'} onClick={() => setActiveCategory('pay')}>
                        Pay Salary
                    </div>
                    {
                        category ? category.map((data, index) => (
                            <div key={data.staffCategoryId} className={activeCategory === data.staffCategoryId ? 'active' : 'navLink'} onClick={() => setActiveCategory(data.staffCategoryId)}>
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
                                <EmployeeCard data={employeeData} />
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
        </div>
    )
}

export default StaffList;