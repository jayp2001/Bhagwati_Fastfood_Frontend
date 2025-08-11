import React, { useState } from 'react'
import './addOns.css'
import axios from 'axios'
import { BACKEND_BASE_URL } from '../../url'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import {
    Modal,
    Box,
    TextField,
    Switch,
    FormControlLabel,
} from '@mui/material'
import { ReactTransliterate } from 'react-transliterate'

const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 'min(1000px, 95vw)',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: '10px',
}

function AddOns() {
    const [open, setOpen] = useState(false)
    const [groupName, setGroupName] = useState('')
    const [addonList, setAddonList] = useState([])
    const [newAddon, setNewAddon] = useState({ addonsName: '', gujaratiName: '', price: '' })

    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}')
    const config = {
        headers: {
            'Content-Type': 'application/json',
            Authorization: userInfo?.token ? `Bearer ${userInfo.token}` : undefined,
        },
    }

    const handleOpen = () => setOpen(true)
    const handleClose = () => {
        setOpen(false)
        setGroupName('')
        setAddonList([])
        setNewAddon({ addonsName: '', gujaratiName: '', price: '' })
    }

    const handleAddAddon = () => {
        if (!newAddon.addonsName?.trim()) {
            toast.error('Addon name is required')
            return
        }
        if (!newAddon.price?.toString().trim()) {
            toast.error('Price is required')
            return
        }
        const priceRegex = /^\d*\.?\d*$/
        if (!priceRegex.test(newAddon.price)) {
            toast.error('Enter a valid price')
            return
        }
        setAddonList(prev => [
            ...prev,
            { addonsName: newAddon.addonsName.trim(), gujaratiName: newAddon.gujaratiName?.trim() || '', price: newAddon.price, isActive: true },
        ])
        setNewAddon({ addonsName: '', gujaratiName: '', price: '' })
    }

    const handleUpdatePrice = (index, value) => {
        const regex = /^\d*\.?\d*$/
        if (!regex.test(value)) return
        setAddonList(prev => prev.map((a, i) => (i === index ? { ...a, price: value } : a)))
    }

    const handleToggleActive = (index) => {
        setAddonList(prev => prev.map((a, i) => (i === index ? { ...a, isActive: !a.isActive } : a)))
    }

    const removeAddon = (index) => {
        setAddonList(prev => prev.filter((_, i) => i !== index))
    }

    const handleSave = async () => {
        if (!groupName.trim()) {
            toast.error('Addon group name is required')
            return
        }
        if (addonList.length === 0) {
            toast.error('Add at least one addon')
            return
        }
        const payload = {
            groupName: groupName.trim(),
            addonList: addonList.map(({ addonsName, price, isActive }) => ({ addonsName, price: Number(price || 0), isActive })),
        }
        try {
            await axios.post(`${BACKEND_BASE_URL}menuItemrouter/updateAddOnsGroupData`, payload, config)
            toast.success('Add-on group saved')
            setTimeout(() => {
                handleClose()
            }, 800)
        } catch (err) {
            console.error(err)
            toast.error(err?.response?.data?.message || 'Failed to save add-on group')
        }
    }

    return (
        <div className='BilingDashboardContainer mx-4 p-3'>
            <ToastContainer />
            <div className='grid grid-cols-12 mt-5'>
                <div className='col-span-12'>
                    <div className='productTableSubContainer'>
                        <div className='h-full grid grid-cols-12'>
                            <div className='h-full mobile:col-span-10  tablet1:col-span-10  tablet:col-span-7  laptop:col-span-7  desktop1:col-span-7  desktop2:col-span-7'>
                                <div className='grid grid-cols-12 pl-6 h-full'>
                                    <div className='flex col-span-3 justify-center productTabAll'>
                                        <div className='statusTabtext'>Add-Ons Group</div>
                                    </div>
                                </div>
                            </div>
                            <div className='grid col-span-2 col-start-11 pr-3 h-full'>
                                <div className='self-center justify-self-end'>
                                    <button className='addProductBtn' onClick={handleOpen}>Add Add-ons</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Modal open={open} onClose={handleClose}>
                <Box sx={modalStyle} className='addProdutModal'>
                    <div className='text-xl p-1 font-semibold mb-3'>Add Add-Ons Group</div>

                    <div className='grid grid-cols-12 gap-4'>
                        <div className='col-span-12'>
                            <TextField
                                size='small'
                                label='Addon Group Name'
                                variant='outlined'
                                className='w-full'
                                value={groupName}
                                onChange={(e) => setGroupName(e.target.value)}
                                autoComplete='off'
                            />
                        </div>
                    </div>

                    <div className='text-lg p-1 mt-5 font-semibold mb-3'>Add Addon</div>

                    <div className='grid grid-cols-12 gap-4 mt-1'>
                        <div className='col-span-5'>
                            <TextField
                                size='small'
                                label='Addon Name'
                                variant='outlined'
                                className='w-full'
                                value={newAddon.addonsName}
                                onChange={(e) => setNewAddon(prev => ({ ...prev, addonsName: e.target.value }))}
                                autoComplete='off'
                            />
                        </div>
                        <div className='col-span-4'>
                            <ReactTransliterate
                                value={newAddon.gujaratiName}
                                onChangeText={(text) => setNewAddon(prev => ({ ...prev, gujaratiName: text }))}
                                className='ao-rtl-input'
                                placeholder='ગુજરાતી નામ'
                                label='Gujarati Name'
                                lang='gu'
                            />
                        </div>
                        <div className='col-span-2'>
                            <TextField
                                size='small'
                                label='Price'
                                variant='outlined'
                                className='w-full'
                                value={newAddon.price}
                                onChange={(e) => {
                                    const val = e.target.value
                                    const regex = /^\d*\.?\d*$/
                                    if (regex.test(val)) setNewAddon(prev => ({ ...prev, price: val }))
                                }}
                                autoComplete='off'
                            />
                        </div>
                        <div className='col-span-1 flex items-center'>
                            <button onClick={handleAddAddon} className='addCategorySaveBtn ao-compact-btn w-full'>Add</button>
                        </div>
                    </div>

                    {addonList.length > 0 && (
                        <div className='mt-6'>
                            <div className='text-lg font-semibold p-1 mb-2'>Add-ons in Group</div>

                            <div style={{
                                maxHeight: '45vh',
                                overflowY: 'auto',
                                overflowX: 'hidden',
                                border: '1px solid #e5e7eb',
                                borderRadius: 8,
                            }}>
                                <div
                                    className='px-3 py-2 sticky top-0 bg-white'
                                    style={{
                                        borderBottom: '1px solid #e5e7eb',
                                        display: 'grid',
                                        gridTemplateColumns: '40px 4fr 3fr 2fr 2fr',
                                        columnGap: '12px',
                                        alignItems: 'center'
                                    }}
                                >
                                    <div className='text-xs font-semibold text-gray-600 text-center'>#</div>
                                    <div className='text-xs font-semibold text-gray-600'>Addon Name</div>
                                    <div className='text-xs font-semibold text-gray-600'>Gujarati Name</div>
                                    <div className='text-xs font-semibold text-gray-600'>Price</div>
                                    <div className='text-xs font-semibold text-gray-600 text-center'>Active / Remove</div>
                                </div>

                                {addonList.map((addon, index) => (
                                    <div
                                        key={index}
                                        className='px-3 py-3'
                                        style={{
                                            borderBottom: '1px solid #f3f4f6',
                                            display: 'grid',
                                            gridTemplateColumns: '40px 4fr 3fr 2fr 2fr',
                                            columnGap: '12px',
                                            alignItems: 'center',
                                            minWidth: 0
                                        }}
                                    >
                                        <div className='text-center'>{index + 1}</div>
                                        <div style={{ minWidth: 0 }}>
                                            <TextField
                                                size='small'
                                                label=''
                                                placeholder='Addon Name'
                                                variant='outlined'
                                                className='w-full'
                                                value={addon.addonsName}
                                                disabled
                                                inputProps={{ style: { whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' } }}
                                            />
                                        </div>
                                        <div style={{ minWidth: 0 }}>
                                            <TextField
                                                size='small'
                                                label=''
                                                placeholder='Gujarati Name'
                                                variant='outlined'
                                                className='w-full'
                                                value={addon.gujaratiName}
                                                disabled
                                                inputProps={{ style: { whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' } }}
                                            />
                                        </div>
                                        <div>
                                            <TextField
                                                size='small'
                                                label=''
                                                placeholder='Price'
                                                variant='outlined'
                                                className='w-full'
                                                value={addon.price}
                                                onChange={(e) => handleUpdatePrice(index, e.target.value)}
                                            />
                                        </div>
                                        <div className='flex items-center justify-center gap-3'>
                                            <Switch checked={addon.isActive} onChange={() => handleToggleActive(index)} />
                                            <button className='rounded-lg bg-gray-100 px-3 py-2 text-sm hover:bg-red-600 hover:text-white' onClick={() => removeAddon(index)}>Remove</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className='flex gap-9 mt-6 w-full mr-7 justify-end px-4'>
                        <div className='w-1/5'>
                            <button onClick={handleSave} className='addCategorySaveBtn ao-compact-btn ml-4 w-full'>Save</button>
                        </div>
                        <div className='w-1/5'>
                            <button onClick={handleClose} className='addCategoryCancleBtn ao-compact-btn ml-4 bg-gray-700 w-full'>Cancel</button>
                        </div>
                    </div>
                </Box>
            </Modal>
        </div>
    )
}

export default AddOns