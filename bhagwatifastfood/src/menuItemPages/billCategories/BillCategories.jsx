import React, { useState, useEffect } from 'react'
import './BillCategories.css'
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
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
} from '@mui/material'
import BorderColorIcon from '@mui/icons-material/BorderColor'
import CloseIcon from '@mui/icons-material/Close'
import StorefrontIcon from '@mui/icons-material/Storefront'
import LanguageIcon from '@mui/icons-material/Language'

const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 'min(1000px, 95vw)',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 2.5,
    borderRadius: '10px',
    maxHeight: '90vh',
    overflowY: 'auto',
}

const viewModalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 'min(800px, 95vw)',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 2.5,
    borderRadius: '10px',
    maxHeight: '90vh',
    overflowY: 'auto',
}

/** Ensures time is in HH:mm:ss format for API payload */
const toTimeFormat = (value) => {
    if (value == null || value === '') return '00:00:00'
    const str = String(value).trim()
    const parts = str.split(':')
    const h = (parts[0] ?? '0').padStart(2, '0')
    const m = (parts[1] ?? '0').padStart(2, '0')
    const s = (parts[2] ?? '0').padStart(2, '0')
    return `${h}:${m}:${s}`
}

const amountRangeRegex = /^-?\d*(?:\.\d*)?$/

/** Converts HH:mm:ss or HH:mm to 12-hour AM/PM format for display */
const to12HourFormat = (value) => {
    if (value == null || value === '') return '-'
    const str = String(value).trim()
    const parts = str.split(':')
    let h = parseInt(parts[0] || '0', 10)
    const m = (parts[1] ?? '0').padStart(2, '0')
    const period = h >= 12 ? 'PM' : 'AM'
    h = h % 12
    if (h === 0) h = 12
    return `${h}:${m} ${period}`
}

function BillCategories() {
    const [billCategories, setBillCategories] = useState([])
    const [loading, setLoading] = useState(false)
    const [editModalOpen, setEditModalOpen] = useState(false)
    const [viewModalOpen, setViewModalOpen] = useState(false)
    const [selectedCategory, setSelectedCategory] = useState(null)
    const [formData, setFormData] = useState({
        // Offline store
        menuId: '',
        offlineMenuName: '',
        firmId: '',
        firmName: '',
        isOfficial: 0,
        billFooterNote: '',
        appriciateLine: '',
        // Online store
        onlineMenuId: '',
        onlineMenuName: '',
        onlineStoreStatus: 1,
        storeStartTime: '00:00:00',
        storeEndTime: '00:00:00',
        amountRange: '',
        stopAutoAcceptStartTime: '00:00:00',
        stopAutoAcceptCloseTime: '00:00:00',
    })
    const [firmList, setFirmList] = useState([])
    const [menuCategoryList, setMenuCategoryList] = useState([])

    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}')
    const config = {
        headers: {
            'Content-Type': 'application/json',
            Authorization: userInfo?.token ? `Bearer ${userInfo.token}` : undefined,
        },
    }

    useEffect(() => {
        fetchBillCategories()
        fetchFirmData()
        fetchMenuCategoryData()
    }, [])

    useEffect(() => {
        if (menuCategoryList.length > 0 && billCategories.length > 0) {
            const updatedCategories = billCategories.map((category) => {
                const updatedCategory = { ...category }
                const offlineMenu = menuCategoryList.find((m) => m.menuCategoryId === category.menuId)
                const onlineMenu = menuCategoryList.find((m) => m.menuCategoryId === category.onlineMenuId)
                if (!category.offlineMenuName && offlineMenu) {
                    updatedCategory.offlineMenuName = offlineMenu.menuCategoryName
                }
                if (!category.onlineMenuName && onlineMenu) {
                    updatedCategory.onlineMenuName = onlineMenu.menuCategoryName
                }
                return updatedCategory
            })
            const hasChanges = updatedCategories.some(
                (cat, index) =>
                    cat.offlineMenuName !== billCategories[index]?.offlineMenuName ||
                    cat.onlineMenuName !== billCategories[index]?.onlineMenuName
            )
            if (hasChanges) {
                setBillCategories(updatedCategories)
            }
        }
    }, [menuCategoryList])

    const fetchBillCategories = async () => {
        setLoading(true)
        try {
            const response = await axios.get(
                `${BACKEND_BASE_URL}billingrouter/getBillCategory`,
                config
            )
            const categoriesArray = Object.keys(response.data).map((key) => ({
                categoryName: key,
                ...response.data[key],
            }))
            setBillCategories(categoriesArray)
        } catch (error) {
            console.error('Error fetching bill categories:', error)
            toast.error('Failed to fetch bill categories')
        } finally {
            setLoading(false)
        }
    }

    const fetchFirmData = async () => {
        try {
            const response = await axios.get(
                `${BACKEND_BASE_URL}billingrouter/ddlFirmData`,
                config
            )
            setFirmList(response.data || [])
        } catch (error) {
            console.error('Error fetching firm data:', error)
            toast.error('Failed to fetch firm data')
        }
    }

    const fetchMenuCategoryData = async () => {
        try {
            const response = await axios.get(
                `${BACKEND_BASE_URL}menuItemrouter/getMenuCategory`,
                config
            )
            setMenuCategoryList(response.data || [])
        } catch (error) {
            console.error('Error fetching menu category data:', error)
            toast.error('Failed to fetch menu category data')
        }
    }

    const handleRowClick = (category) => {
        setSelectedCategory(category)
        setViewModalOpen(true)
    }

    const handleEdit = (e, category) => {
        e.stopPropagation()
        const categoryToUse = billCategories.find((c) => c.categoryName === category.categoryName) || category
        const firm = firmList.find((f) => f.firmId === categoryToUse.firmId) || firmList[0]
        const offlineMenu = menuCategoryList.find((m) => m.menuCategoryId === categoryToUse.menuId) || menuCategoryList[0]
        const onlineMenu = menuCategoryList.find((m) => m.menuCategoryId === categoryToUse.onlineMenuId) || menuCategoryList[0]

        setSelectedCategory(categoryToUse)
        setFormData({
            menuId: categoryToUse.menuId || (menuCategoryList[0]?.menuCategoryId ?? ''),
            offlineMenuName: categoryToUse.offlineMenuName || offlineMenu?.menuCategoryName || '',
            firmId: categoryToUse.firmId || (firmList[0]?.firmId ?? ''),
            firmName: categoryToUse.firmName || firm?.firmName || '',
            isOfficial: categoryToUse.isOfficial ?? 0,
            billFooterNote: categoryToUse.billFooterNote ?? '',
            appriciateLine: categoryToUse.appriciateLine ?? '',
            onlineMenuId: categoryToUse.onlineMenuId || (menuCategoryList[0]?.menuCategoryId ?? ''),
            onlineMenuName: categoryToUse.onlineMenuName || onlineMenu?.menuCategoryName || '',
            onlineStoreStatus: categoryToUse.onlineStoreStatus ?? 1,
            storeStartTime: (categoryToUse.storeStartTime || '00:00:00').slice(0, 5),
            storeEndTime: (categoryToUse.storeEndTime || '00:00:00').slice(0, 5),
            amountRange: (categoryToUse.amountRange === 0 || categoryToUse.amountRange === '0' || categoryToUse.amountRange === '' || categoryToUse.amountRange == null) ? '' : String(categoryToUse.amountRange),
            stopAutoAcceptStartTime: (categoryToUse.stopAutoAcceptStartTime || '00:00:00').slice(0, 5),
            stopAutoAcceptCloseTime: (categoryToUse.stopAutoAcceptCloseTime || '00:00:00').slice(0, 5),
        })
        setEditModalOpen(true)
    }

    useEffect(() => {
        if (editModalOpen && selectedCategory && (menuCategoryList.length > 0 || firmList.length > 0)) {
            setFormData((prev) => {
                const menu = menuCategoryList.find((m) => m.menuCategoryId === prev.menuId) || menuCategoryList[0]
                const onlineMenu = menuCategoryList.find((m) => m.menuCategoryId === prev.onlineMenuId) || menuCategoryList[0]
                const firm = firmList.find((f) => f.firmId === prev.firmId) || firmList[0]
                return {
                    ...prev,
                    menuId: prev.menuId || (menu?.menuCategoryId ?? ''),
                    offlineMenuName: prev.offlineMenuName || (menu?.menuCategoryName ?? ''),
                    firmId: prev.firmId || (firm?.firmId ?? ''),
                    firmName: prev.firmName || (firm?.firmName ?? ''),
                    onlineMenuId: prev.onlineMenuId || (onlineMenu?.menuCategoryId ?? ''),
                    onlineMenuName: prev.onlineMenuName || (onlineMenu?.menuCategoryName ?? ''),
                }
            })
        }
    }, [menuCategoryList, firmList, editModalOpen, selectedCategory])

    const handleCloseEditModal = () => {
        setEditModalOpen(false)
        setSelectedCategory(null)
        setFormData({
            menuId: '',
            offlineMenuName: '',
            firmId: '',
            firmName: '',
            isOfficial: 0,
            billFooterNote: '',
            appriciateLine: '',
            onlineMenuId: '',
            onlineMenuName: '',
            onlineStoreStatus: 1,
            storeStartTime: '00:00:00',
            storeEndTime: '00:00:00',
            amountRange: '',
            stopAutoAcceptStartTime: '00:00:00',
            stopAutoAcceptCloseTime: '00:00:00',
        })
    }

    const handleCloseViewModal = () => {
        setViewModalOpen(false)
        setSelectedCategory(null)
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target
        let parsed = value
        if (name === 'amountRange') {
            const digitCount = (value.match(/\d/g) || []).length
            if (value !== '' && (!amountRangeRegex.test(value) || digitCount > 5)) return
            parsed = value === '' ? '' : value
        }
        setFormData((prev) => ({ ...prev, [name]: parsed }))
    }

    const handleMenuSelect = (field) => (e) => {
        const menuId = e.target.value
        const menu = menuCategoryList.find((m) => m.menuCategoryId === menuId)
        if (field === 'offline') {
            setFormData((prev) => ({
                ...prev,
                menuId,
                offlineMenuName: menu?.menuCategoryName ?? '',
            }))
        } else {
            setFormData((prev) => ({
                ...prev,
                onlineMenuId: menuId,
                onlineMenuName: menu?.menuCategoryName ?? '',
            }))
        }
    }

    const handleFirmSelect = (e) => {
        const firmId = e.target.value
        const firm = firmList.find((f) => f.firmId === firmId)
        setFormData((prev) => ({
            ...prev,
            firmId,
            firmName: firm?.firmName ?? '',
        }))
    }

    const handleSwitchChange = (name) => (e) => {
        setFormData((prev) => ({
            ...prev,
            [name]: e.target.checked ? 1 : 0,
        }))
    }

    const handleSubmit = async () => {
        if (!selectedCategory) return

        const menuId = formData.menuId || menuCategoryList[0]?.menuCategoryId
        const firmId = formData.firmId || firmList[0]?.firmId
        const firm = firmList.find((f) => f.firmId === firmId)
        const menu = menuCategoryList.find((m) => m.menuCategoryId === menuId)
        const onlineMenu = menuCategoryList.find((m) => m.menuCategoryId === formData.onlineMenuId)

        if (!menuId || !firmId) {
            toast.error('Menu Category and Firm are required fields')
            return
        }

        const categoryId = selectedCategory.categoryId || selectedCategory.categoryName?.toLowerCase()?.replace(/\s+/g, '')

        if (!categoryId) {
            toast.error('Category ID is missing. Please refresh and try again.')
            return
        }

        try {
            setLoading(true)
            const updateData = {
                categoryId,
                menuId,
                offlineMenuName: formData.offlineMenuName || menu?.menuCategoryName || '',
                onlineMenuId: formData.onlineMenuId || menuCategoryList[0]?.menuCategoryId,
                onlineMenuName: formData.onlineMenuName || onlineMenu?.menuCategoryName || '',
                firmId,
                firmName: formData.firmName || firm?.firmName || '',
                isOfficial: formData.isOfficial,
                onlineStoreStatus: formData.onlineStoreStatus,
                storeStartTime: toTimeFormat(formData.storeStartTime),
                storeEndTime: toTimeFormat(formData.storeEndTime),
                amountRange: formData.amountRange || '',
                stopAutoAcceptStartTime: toTimeFormat(formData.stopAutoAcceptStartTime),
                stopAutoAcceptCloseTime: toTimeFormat(formData.stopAutoAcceptCloseTime),
                billFooterNote: formData.billFooterNote ?? '',
                appriciateLine: formData.appriciateLine ?? '',
            }
            await axios.post(
                `${BACKEND_BASE_URL}billingrouter/updateBillCategoryData`,
                updateData,
                config
            )
            toast.success('Category updated successfully')
            handleCloseEditModal()
            fetchBillCategories()
        } catch (error) {
            console.error('Error updating category:', error)
            toast.error(error.response?.data?.message || 'Failed to update category')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className='billCategoriesContainer'>
            <div className='userTableSubContainerBillCategories'>
                <div className='tableContainerWrapper'>
                    <TableContainer
                        sx={{
                            borderBottomLeftRadius: '10px',
                            borderBottomRightRadius: '10px',
                            paddingLeft: '10px',
                            paddingRight: '10px',
                        }}
                        component={Paper}
                    >
                        <Table sx={{ minWidth: 650 }} stickyHeader aria-label="sticky table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>No.</TableCell>
                                    <TableCell>Category</TableCell>
                                    <TableCell>Menu Category</TableCell>
                                    <TableCell>Firm Name</TableCell>
                                    <TableCell>Online Store</TableCell>
                                    <TableCell align="center">Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {billCategories?.length > 0 ? (
                                    billCategories.map((category, index) => (
                                        <TableRow
                                            hover
                                            key={category.categoryId || index}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                            className='tableRow'
                                            style={{ cursor: 'pointer' }}
                                            onClick={() => handleRowClick(category)}
                                        >
                                            <TableCell align="left">{index + 1}</TableCell>
                                            <TableCell component="th" scope="row">
                                                {category.categoryName}
                                            </TableCell>
                                            <TableCell align="left">
                                                {category.offlineMenuName ||
                                                    menuCategoryList.find((m) => m.menuCategoryId === category.menuId)?.menuCategoryName ||
                                                    '-'}
                                            </TableCell>
                                            <TableCell align="left">{category.firmName || '-'}</TableCell>
                                            <TableCell align="left">
                                                <span className={category.onlineStoreStatus == 1 ? 'statusOpen' : 'statusClose'}>
                                                    {category.onlineStoreStatus == 1 ? 'Open' : 'Close'}
                                                </span>
                                            </TableCell>
                                            <TableCell align="center">
                                                <IconButton
                                                    onClick={(e) => handleEdit(e, category)}
                                                    sx={{
                                                        width: 32,
                                                        height: 32,
                                                        backgroundColor: '#1976d2',
                                                        color: 'white',
                                                        '&:hover': { backgroundColor: '#1565c0' },
                                                    }}
                                                >
                                                    <BorderColorIcon sx={{ fontSize: 18 }} />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow key="no-data" sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                        <TableCell
                                            align="center"
                                            style={{ fontSize: '18px', fontWeight: '500', padding: '40px' }}
                                            colSpan={5}
                                        >
                                            {loading ? 'Loading...' : 'No Data Found...!'}
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>
            </div>

            {/* View Modal */}
            <Modal open={viewModalOpen} onClose={handleCloseViewModal} aria-labelledby="view-modal-title">
                <Box sx={viewModalStyle}>
                    <div className='modalHeader'>
                        <h2 id="view-modal-title">Bill Category Details</h2>
                        <IconButton onClick={handleCloseViewModal} sx={{ color: 'gray' }}>
                            <CloseIcon />
                        </IconButton>
                    </div>
                    {selectedCategory && (
                        <div className='viewModalContent'>
                            <div className='categoryNameDisplay'>
                                <span className='categoryNameLabel'>Category:</span>
                                <span className='categoryNameValue'>{selectedCategory.categoryName}</span>
                            </div>
                            <div className='viewModalSections'>
                                <div className='viewModalSection'>
                                    <div className='viewModalSectionHeader'>
                                        <StorefrontIcon fontSize="small" />
                                        <span>Offline Store</span>
                                    </div>
                                    <div className='detailRow'>
                                        <span className='detailLabel'>Menu Category:</span>
                                        <span className='detailValue'>{selectedCategory.offlineMenuName || selectedCategory.menuCategoryName || '-'}</span>
                                    </div>
                                    <div className='detailRow'>
                                        <span className='detailLabel'>Firm Name:</span>
                                        <span className='detailValue'>{selectedCategory.firmName || '-'}</span>
                                    </div>
                                    <div className='detailRow'>
                                        <span className='detailLabel'>Is Official:</span>
                                        <span className='detailValue'>{selectedCategory.isOfficial === 1 ? 'Yes' : 'No'}</span>
                                    </div>
                                    <div className='detailRow fullWidth'>
                                        <span className='detailLabel'>Bill Footer Note:</span>
                                        <span className='detailValue'>{selectedCategory.billFooterNote || '-'}</span>
                                    </div>
                                    <div className='detailRow fullWidth'>
                                        <span className='detailLabel'>Appreciate Line:</span>
                                        <span className='detailValue'>{selectedCategory.appriciateLine || '-'}</span>
                                    </div>
                                </div>
                                <div className='viewModalSection'>
                                    <div className='viewModalSectionHeader'>
                                        <LanguageIcon fontSize="small" />
                                        <span>Online Store</span>
                                    </div>
                                    <div className='detailRow'>
                                        <span className='detailLabel'>Status:</span>
                                        <span className='detailValue'>{selectedCategory.onlineStoreStatus == 1 ? 'Open' : 'Close'}</span>
                                    </div>
                                    <div className='detailRow'>
                                        <span className='detailLabel'>Online Menu:</span>
                                        <span className='detailValue'>{selectedCategory.onlineMenuName || '-'}</span>
                                    </div>
                                    <div className='detailRow'>
                                        <span className='detailLabel'>Store Hours:</span>
                                        <span className='detailValue'>
                                            {to12HourFormat(selectedCategory.storeStartTime)} - {to12HourFormat(selectedCategory.storeEndTime)}
                                        </span>
                                    </div>
                                    <div className='detailRow'>
                                        <span className='detailLabel'>Amount Range:</span>
                                        <span className='detailValue'>{selectedCategory.amountRange ?? '-'}</span>
                                    </div>
                                    <div className='detailRow'>
                                        <span className='detailLabel'>Stop Auto Accept:</span>
                                        <span className='detailValue'>
                                            {to12HourFormat(selectedCategory.stopAutoAcceptStartTime)} - {to12HourFormat(selectedCategory.stopAutoAcceptCloseTime)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </Box>
            </Modal>

            {/* Edit Modal */}
            <Modal open={editModalOpen} onClose={handleCloseEditModal} aria-labelledby="edit-modal-title">
                <Box sx={modalStyle}>
                    <div className='modalHeader'>
                        <h2 id="edit-modal-title">
                            Edit Bill Category
                            {selectedCategory && (
                                <span className='modalHeaderCategory'> — {selectedCategory.categoryName}</span>
                            )}
                        </h2>
                        <IconButton onClick={handleCloseEditModal} sx={{ color: 'gray' }}>
                            <CloseIcon />
                        </IconButton>
                    </div>
                    {selectedCategory && (
                        <div className='editModalContent'>
                            <div className='editModalSections'>
                                <div className='editModalSection'>
                                    <div className='editModalSectionHeader'>
                                        <StorefrontIcon fontSize="small" />
                                        <span>Offline Store</span>
                                    </div>
                                    <FormControl fullWidth size="small" required>
                                        <InputLabel>Menu Category *</InputLabel>
                                        <Select
                                            name="menuId"
                                            value={formData.menuId || ''}
                                            onChange={handleMenuSelect('offline')}
                                            label="Menu Category *"
                                        >
                                            {menuCategoryList.map((menu) => (
                                                <MenuItem key={menu.menuCategoryId} value={menu.menuCategoryId}>
                                                    {menu.menuCategoryName}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                    <FormControl fullWidth size="small" required>
                                        <InputLabel>Firm *</InputLabel>
                                        <Select
                                            name="firmId"
                                            value={formData.firmId || ''}
                                            onChange={handleFirmSelect}
                                            label="Firm *"
                                        >
                                            {firmList.map((firm) => (
                                                <MenuItem key={firm.firmId} value={firm.firmId}>
                                                    {firm.firmName}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                    <div className='formRow'>
                                        <FormControlLabel
                                            control={<Switch checked={formData.isOfficial === 1} onChange={handleSwitchChange('isOfficial')} color="primary" />}
                                            label="Is Official"
                                        />
                                    </div>
                                    <TextField
                                        fullWidth
                                        size="small"
                                        label="Bill Footer Note"
                                        name="billFooterNote"
                                        value={formData.billFooterNote}
                                        onChange={handleInputChange}
                                        variant="outlined"
                                        multiline
                                        rows={2}
                                    />
                                    <TextField
                                        fullWidth
                                        size="small"
                                        label="Appreciate Line"
                                        name="appriciateLine"
                                        value={formData.appriciateLine}
                                        onChange={handleInputChange}
                                        variant="outlined"
                                        multiline
                                        rows={2}
                                    />
                                </div>
                                <div className='editModalSection'>
                                    <div className='editModalSectionHeader'>
                                        <LanguageIcon fontSize="small" />
                                        <span>Online Store</span>
                                    </div>
                                    <div className='formRow'>
                                        <FormControlLabel
                                            control={
                                                <Switch
                                                    checked={formData.onlineStoreStatus === 1}
                                                    onChange={handleSwitchChange('onlineStoreStatus')}
                                                    color="primary"
                                                />
                                            }
                                            label={`Online Store Status (${formData.onlineStoreStatus == 1 ? 'Open' : 'Close'})`}
                                        />
                                    </div>
                                    <FormControl fullWidth size="small" disabled={formData.onlineStoreStatus != 1}>
                                        <InputLabel>Online Menu</InputLabel>
                                        <Select
                                            name="onlineMenuId"
                                            value={formData.onlineMenuId || ''}
                                            onChange={handleMenuSelect('online')}
                                            label="Online Menu"
                                        >
                                            {menuCategoryList.map((menu) => (
                                                <MenuItem key={menu.menuCategoryId} value={menu.menuCategoryId}>
                                                    {menu.menuCategoryName}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                    <div className='formRow formRowGrid'>
                                        <TextField
                                            fullWidth
                                            size="small"
                                            label="Store Start Time"
                                            name="storeStartTime"
                                            type="time"
                                            value={formData.storeStartTime}
                                            onChange={handleInputChange}
                                            variant="outlined"
                                            InputLabelProps={{ shrink: true }}
                                            disabled={formData.onlineStoreStatus != 1}
                                        />
                                        <TextField
                                            fullWidth
                                            size="small"
                                            label="Store End Time"
                                            name="storeEndTime"
                                            type="time"
                                            value={formData.storeEndTime}
                                            onChange={handleInputChange}
                                            variant="outlined"
                                            InputLabelProps={{ shrink: true }}
                                            disabled={formData.onlineStoreStatus != 1}
                                        />
                                    </div>
                                    <TextField
                                        fullWidth
                                        size="small"
                                        label="Amount Range"
                                        name="amountRange"
                                        type="text"
                                        value={formData.amountRange}
                                        onChange={handleInputChange}
                                        variant="outlined"
                                        inputProps={{ maxLength: 7 }}
                                        disabled={formData.onlineStoreStatus != 1}
                                    />
                                    <div className='formRow formRowGrid'>
                                        <TextField
                                            fullWidth
                                            size="small"
                                            label="Stop Auto Accept Start"
                                            name="stopAutoAcceptStartTime"
                                            type="time"
                                            value={formData.stopAutoAcceptStartTime}
                                            onChange={handleInputChange}
                                            variant="outlined"
                                            InputLabelProps={{ shrink: true }}
                                            disabled={formData.onlineStoreStatus != 1}
                                        />
                                        <TextField
                                            fullWidth
                                            size="small"
                                            label="Stop Auto Accept End"
                                            name="stopAutoAcceptCloseTime"
                                            type="time"
                                            value={formData.stopAutoAcceptCloseTime}
                                            onChange={handleInputChange}
                                            variant="outlined"
                                            InputLabelProps={{ shrink: true }}
                                            disabled={formData.onlineStoreStatus != 1}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className='formActions'>
                                <button className='stockOutBtnBillCategories' onClick={handleCloseEditModal}>Cancel</button>
                                <button className='stockInBtnBillCategories' onClick={handleSubmit} disabled={loading}>
                                    {loading ? 'Updating...' : 'Update'}
                                </button>
                            </div>
                        </div>
                    )}
                </Box>
            </Modal>

            <ToastContainer />
        </div>
    )
}

export default BillCategories
