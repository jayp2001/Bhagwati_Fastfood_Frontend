import { Button } from '@mui/material';
import Menutemp from './menu';
import './productCard.css'
import VisibilityIcon from '@mui/icons-material/Visibility';
function ProductCard(props) {
    return (
        <div className="productCard" key={props.productId}>
            <div className='grid grid-cols-12'>
                <div className='col-span-11 productName'>
                    {props.productData.productName}
                </div>
                <Menutemp />
            </div>
            <div className='mt-1 minStock'>
                Min. Stock : <span className='minStockDisplay'>{props.productData.minProductQty} {props.productData.minProductUnit}</span>
            </div>
            <div className='mt-4'>
                <div className='stockFieldHeader'>
                    Remaining Stock:
                </div>
                <div className='mt-2 stockFieldWrp'>
                    {props.productData.remainingStock}
                </div>
            </div>
            <div className='mt-3 grid grid-cols-12 gap-2'>
                <div className='col-span-6 text-center stockFieldHeader'>
                    Stocked In:
                </div>
                <div className='col-span-6 text-center stockFieldHeader'>
                    Stocked At:
                </div>
            </div>
            <div className='grid grid-cols-12 gap-2'>
                <div className='col-span-6 text-center stockedField'>
                    {props.productData.lastUpdatedQty} {props.productData.minProductUnit}
                </div>
                <div className='col-span-6 text-center stockedField'>
                    {props.productData.lastUpdatedStockInDate}
                </div>
            </div>
            <div className='mt-6 stockBtnWrp'>
                <div className='grid gap-4 grid-cols-12'>
                    <div className='col-span-6'>
                        <button className='stockInBtn'>Stock In</button>
                    </div>
                    <div className='col-span-6'>
                        <button className='stockOutBtn'>Stock Out</button>
                    </div>
                </div>
                <div className='mt-4'>
                    <button className='viewDetailBtn'><VisibilityIcon fontSize='small' /> &nbsp;&nbsp;View Details</button>
                </div>
            </div>
        </div>
    )
}

export default ProductCard;