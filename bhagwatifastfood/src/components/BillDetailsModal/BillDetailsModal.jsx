import React, { useState, useEffect } from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import PersonIcon from '@mui/icons-material/Person';
import PrintIcon from '@mui/icons-material/Print';
import axios from 'axios';
import { BACKEND_BASE_URL } from '../../url';

const modalStyle = {
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
    flexDirection: 'column',
};

/**
 * Reusable Bill Details Modal component.
 * Fetches and displays bill details by billId.
 * @param {Object} props
 * @param {boolean} props.open - Whether the modal is open
 * @param {Function} props.onClose - Callback when modal is closed
 * @param {string} props.billId - Bill ID to fetch and display
 * @param {Function} props.onError - Optional callback for API errors (e.g. to show toast)
 */
function BillDetailsModal({ open, onClose, billId, onError }) {
    const [billData, setBillData] = useState(null);
    const [loading, setLoading] = useState(false);

    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    const config = {
        headers: {
            'Content-Type': 'application/json',
            Authorization: userInfo?.token ? `Bearer ${userInfo.token}` : undefined,
        },
    };

    useEffect(() => {
        if (open && billId) {
            setLoading(true);
            setBillData(null);
            axios.get(`${BACKEND_BASE_URL}billingrouter/getBillDataById?billId=${billId}`, config)
                .then((res) => {
                    setBillData(res.data);
                })
                .catch((err) => {
                    const msg = err.response?.data || 'Failed to load bill details';
                    if (onError) onError(msg);
                    setBillData(null);
                })
                .finally(() => {
                    setLoading(false);
                });
        } else {
            setBillData(null);
        }
    }, [open, billId]);

    const handlePrint = async () => {
        if (!billData?.billId) return;
        try {
            await axios.get(
                `${BACKEND_BASE_URL}billingrouter/printBillInAdminSystem?billId=${billData.billId}`,
                config
            );
            onClose?.();
            setBillData(null);
        } catch (err) {
            const msg = err.response?.data || 'Failed to print bill';
            if (onError) onError(msg);
        }
    };

    const data = billData;

    return (
        <Modal open={open} onClose={onClose} aria-labelledby="bill-details-modal" disableAutoFocus>
            <Box sx={modalStyle} className="rounded-md border-none">
                <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white py-3 px-5 rounded-t-lg flex-shrink-0 relative">
                    <IconButton
                        onClick={onClose}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                            color: 'white',
                            backgroundColor: 'rgba(255, 255, 255, 0.2)',
                            '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.3)' },
                            width: 28,
                            height: 28,
                        }}
                    >
                        <CloseIcon sx={{ fontSize: 18 }} />
                    </IconButton>
                    {loading ? (
                        <div className="text-center text-base font-bold py-2">Loading...</div>
                    ) : (
                        <>
                            <div className="text-center text-base font-bold">
                                {data?.firmData?.firmName || 'Bill Details'}
                            </div>
                            <div className="text-center text-xs mt-1 opacity-90">
                                {data?.firmData?.firmAddress}
                            </div>
                            <div className="text-center text-xs mt-0.5 opacity-85">
                                {data?.firmData?.firmMobileNo}
                                {data?.firmData?.gstNumber && ` | GST: ${data.firmData.gstNumber}`}
                            </div>
                        </>
                    )}
                </div>

                {!loading && data && (
                    <>
                        <div className="px-4 py-2 bg-gray-100 flex-shrink-0 border-b border-gray-300">
                            <div className="flex items-center justify-between text-xs">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <span className="font-bold text-gray-900">#{data.billNumber}</span>
                                    <span className="text-gray-400">•</span>
                                    <span className="font-bold text-gray-900">Tkn : {data.tokenNo}</span>
                                    <span className="text-gray-400">•</span>
                                    <span className="font-semibold text-gray-700">{data.billType}</span>
                                    <span className="text-gray-400">•</span>
                                    <PersonIcon sx={{ fontSize: 14 }} />
                                    <span className="font-medium text-gray-700">{data.cashier}</span>
                                    <span className="text-gray-400">•</span>
                                    <span className="text-gray-600">{data.billDate} {data.billTime}</span>
                                </div>
                                <div>
                                    <span
                                        className={`px-2 py-0.5 rounded text-xs text-white font-semibold uppercase ${
                                            data.billPayType === 'Cancel' ? 'bg-red-600' :
                                            data.billPayType === 'cash' ? 'bg-green-600' :
                                            data.billPayType === 'online' ? 'bg-blue-600' :
                                            data.billPayType === 'due' ? 'bg-orange-600' :
                                            data.billPayType === 'debit' ? 'bg-purple-600' : 'bg-gray-600'
                                        }`}
                                    >
                                        {data.billPayType}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div style={{ overflowY: 'auto', flexGrow: 1, minHeight: 0 }}>
                            {data.customerDetails?.customerName && (
                                <div className="px-4 py-2 bg-blue-50 border-y border-gray-200">
                                    <div className="space-y-0.5">
                                        <div className="text-xs">
                                            <span className="text-gray-600">Customer: </span>
                                            <span className="font-semibold text-gray-900">{data.customerDetails.customerName}</span>
                                        </div>
                                        {data.customerDetails.mobileNo && (
                                            <div className="text-xs">
                                                <span className="text-gray-600">Mobile: </span>
                                                <span className="font-semibold text-gray-900">{data.customerDetails.mobileNo}</span>
                                            </div>
                                        )}
                                        {data.customerDetails.address && (
                                            <div className="text-xs">
                                                <span className="text-gray-600">Address: </span>
                                                <span className="font-medium text-gray-900">{data.customerDetails.address}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {data.hotelDetails?.hotelName && (
                                <div className="px-4 py-2 bg-blue-50 border-b border-gray-200">
                                    <div className="space-y-0.5">
                                        <div className="text-xs">
                                            <span className="text-gray-600">Hotel: </span>
                                            <span className="font-semibold text-gray-900">
                                                {data.hotelDetails.hotelName}
                                                {data.hotelDetails.roomNo ? ' - Rm ' + data.hotelDetails.roomNo : ''}
                                            </span>
                                        </div>
                                        {data.hotelDetails.customerName && (
                                            <div className="text-xs">
                                                <span className="text-gray-600">Guest: </span>
                                                <span className="font-semibold text-gray-900">{data.hotelDetails.customerName}</span>
                                            </div>
                                        )}
                                        {data.hotelDetails.phoneNumber && (
                                            <div className="text-xs">
                                                <span className="text-gray-600">Phone: </span>
                                                <span className="font-semibold text-gray-900">{data.hotelDetails.phoneNumber}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            <div className="bg-white">
                                <div className="overflow-y-auto border-y border-gray-200" style={{ height: '240px' }}>
                                    <table className="w-full text-xs">
                                        <thead className="bg-gray-100 sticky top-0 z-10">
                                            <tr>
                                                <th className="text-left py-2.5 pl-4 pr-2 font-semibold border-b-2 border-gray-300" style={{ width: '40px' }}>Sr.</th>
                                                <th className="text-left py-2.5 px-2 font-semibold border-b-2 border-gray-300">Item</th>
                                                <th className="text-center py-2.5 px-3 font-semibold border-b-2 border-gray-300">Qty</th>
                                                <th className="text-right py-2.5 px-3 font-semibold border-b-2 border-gray-300">Price</th>
                                                <th className="text-right py-2.5 pl-3 pr-4 font-semibold border-b-2 border-gray-300">Total</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {data.itemData?.map((item, index) => (
                                                <tr key={index} className="border-b border-gray-100 hover:bg-blue-50">
                                                    <td className="py-2 pl-4 pr-2 font-medium text-gray-600">{index + 1}</td>
                                                    <td className="py-2 px-2 font-semibold text-gray-800">{item.itemName}</td>
                                                    <td className="py-2 px-3 text-center font-medium text-gray-700">{item.qty} {item.unit}</td>
                                                    <td className="py-2 px-3 text-right text-gray-700">₹{parseFloat(item.itemPrice).toLocaleString('en-IN')}</td>
                                                    <td className="py-2 pl-3 pr-4 text-right font-bold text-green-700">₹{parseFloat(item.price).toLocaleString('en-IN')}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        <div className="flex-shrink-0 border-t-2 border-gray-300 bg-gray-50">
                            <div className="px-4 py-3">
                                {data.discountType && data.discountType !== 'none' && (
                                    <div className="flex justify-between items-center mb-1.5 pb-1.5 border-b border-gray-300 text-xs">
                                        <span className="font-medium text-gray-700">
                                            Discount ({data.discountType === 'percentage' ? data.discountValue + '%' : '₹' + data.discountValue})
                                        </span>
                                        <span className="font-bold text-red-600">
                                            - ₹{parseFloat(data.totalDiscount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                        </span>
                                    </div>
                                )}
                                <div className="flex justify-between items-center mb-2 pb-1.5 border-b-2 border-gray-400 text-sm">
                                    <span className="font-bold text-gray-800">Total Amount</span>
                                    <span className="font-bold text-green-700">
                                        ₹{parseFloat(data.totalAmount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center py-2 px-3 bg-blue-100 rounded border-2 border-blue-400 mb-2">
                                    <span className="text-base font-bold text-blue-900">Grand Total</span>
                                    <span className="text-lg font-bold text-blue-900">
                                        ₹{parseFloat(data.settledAmount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </span>
                                </div>
                                {data.billComment && (
                                    <div className="p-2 bg-yellow-100 border-l-4 border-yellow-500 rounded text-xs">
                                        <span className="font-semibold text-yellow-800">Comment: </span>
                                        <span className="font-medium text-gray-800">{data.billComment}</span>
                                    </div>
                                )}
                            </div>
                            <div className="px-4 py-3 bg-white border-t border-gray-200 flex justify-center rounded-b-lg">
                                <button
                                    className="px-8 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors font-semibold flex items-center gap-2 shadow-md"
                                    onClick={handlePrint}
                                >
                                    <PrintIcon sx={{ fontSize: 18 }} />
                                    Print Bill
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </Box>
        </Modal>
    );
}

export default BillDetailsModal;
