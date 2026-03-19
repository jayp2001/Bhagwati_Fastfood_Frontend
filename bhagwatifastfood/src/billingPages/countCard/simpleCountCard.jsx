import './countCard.css';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import ProductionQuantityLimitsIcon from '@mui/icons-material/ProductionQuantityLimits';
import LocalMallOutlinedIcon from '@mui/icons-material/LocalMallOutlined';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import AttachMoneyOutlinedIcon from '@mui/icons-material/AttachMoneyOutlined';
import PriceCheckOutlinedIcon from '@mui/icons-material/PriceCheckOutlined';
import PaymentOutlinedIcon from '@mui/icons-material/PaymentOutlined';
import CardGiftcardOutlinedIcon from '@mui/icons-material/CardGiftcardOutlined';
import RequestQuoteOutlinedIcon from '@mui/icons-material/RequestQuoteOutlined';
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined';
import CreditScoreOutlinedIcon from '@mui/icons-material/CreditScoreOutlined';
import DeliveryDiningIcon from '@mui/icons-material/DeliveryDining';
import FoodBankIcon from '@mui/icons-material/FoodBank';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import AlarmIcon from '@mui/icons-material/Alarm';
import StorefrontIcon from '@mui/icons-material/Storefront';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import RedeemIcon from '@mui/icons-material/Redeem';
import CancelIcon from '@mui/icons-material/Cancel';
import DiscountIcon from '@mui/icons-material/Discount';
import PeopleIcon from '@mui/icons-material/People';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AssessmentIcon from '@mui/icons-material/Assessment';
import PaymentsIcon from '@mui/icons-material/Payments';
import GavelIcon from '@mui/icons-material/Gavel';
import DoDisturbIcon from '@mui/icons-material/DoDisturb';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ContentCutIcon from '@mui/icons-material/ContentCut';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import ScheduleIcon from '@mui/icons-material/Schedule';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import ReceiptIcon from '@mui/icons-material/Receipt';

function SimpleCountCard(props) {
    const getImg = (imgname) => {
        switch (imgname) {
            // Original cases
            case 'Total Purchase':
                return <AddShoppingCartIcon fontSize='large' />;
            case 'Total Cost':
                return <CurrencyExchangeIcon fontSize='large' />;
            case 'Total Used':
                return <ShoppingCartCheckoutIcon fontSize='large' />;
            case 'Remaining Stock':
                return <LocalMallOutlinedIcon fontSize='large' />;
            case 'Last Purchase Price':
                return <AttachMoneyOutlinedIcon fontSize='large' />;
            case 'Min Product Qty':
                return <ProductionQuantityLimitsIcon fontSize='large' />;
            case 'Total Business':
                return <CurrencyExchangeIcon fontSize='large' />;
            case 'Remaining Payment':
                return <CardGiftcardOutlinedIcon fontSize='large' />;
            case 'Total Remaining':
                return <CardGiftcardOutlinedIcon fontSize='large' />;
            case 'Paid Debit':
                return <CreditScoreOutlinedIcon fontSize='large' />;
            case 'Total Debit':
                return <PaymentOutlinedIcon fontSize='large' />;
            case 'Paid':
                return <PriceCheckOutlinedIcon fontSize='large' />;
            case 'Total Cash':
                return <RequestQuoteOutlinedIcon fontSize='large' />;
            case 'Total Product':
                return <ReceiptLongOutlinedIcon fontSize='large' />;
            case 'Delivery Round':
                return <DeliveryDiningIcon fontSize='large' />;
            case 'No. Of Other Work':
                return <DirectionsRunIcon fontSize='large' />;
            case 'No. Of Parcel':
                return <FoodBankIcon fontSize='large' />;
            case 'Work Time':
                return <AlarmIcon fontSize='large' />;
            case 'Parcel Ammount':
                return <CardGiftcardOutlinedIcon fontSize='large' />;
            case 'Settled Up':
                return <CardGiftcardOutlinedIcon fontSize='large' />;
            case 'You will get':
                return <CardGiftcardOutlinedIcon fontSize='large' />;
            case 'Total Due':
                return <CreditScoreOutlinedIcon fontSize='large' />;
            case 'Total Paid':
                return <PriceCheckOutlinedIcon fontSize='large' />;

            // New customer statistics cases
            case 'Pickup Summary':
                return <StorefrontIcon fontSize='large' />;
            case 'Delivery Summary':
                return <DeliveryDiningIcon fontSize='large' />;
            case 'DineIn Summary':
                return <RestaurantIcon fontSize='large' />;
            case 'Cash Summary':
            case 'Cash Payment':
                return <LocalAtmIcon fontSize='large' />;
            case 'Due Summary':
            case 'Due Payment':
                return <AccountBalanceWalletIcon fontSize='large' />;
            case 'Online Summary':
            case 'Online Payment':
                return <CreditCardIcon fontSize='large' />;
            case 'Complimentary Summary':
            case 'Complimentary Order':
                return <RedeemIcon fontSize='large' />;
            case 'Cancel Summary':
            case 'Cancel Order':
                return <CancelIcon fontSize='large' />;
            case 'Total Discount':
                return <DiscountIcon fontSize='large' />;
            case 'Visit':
                return <PeopleIcon fontSize='large' />;
            case 'Total Last Month Visit':
                return <CalendarMonthIcon fontSize='large' />;
            case 'Average Visit Per Month':
                return <CalendarMonthIcon fontSize='large' />;
            case 'Average Business Per Year':
                return <TrendingUpIcon fontSize='large' />;

            // Firm/Business stats
            case 'Total Cancel':
                return <CancelIcon fontSize='large' />;
            case 'Cash Business':
                return <LocalAtmIcon fontSize='large' />;
            case 'Online Business':
                return <CreditCardIcon fontSize='large' />;
            case 'Debit Business':
                return <PaymentOutlinedIcon fontSize='large' />;
            case 'Due Business':
                return <AccountBalanceWalletIcon fontSize='large' />;

            // Staff/Employee stats
            case 'Total Advance':
                return <AddCircleOutlineIcon fontSize='large' />;
            case 'Remaining Advance':
                return <RemoveCircleOutlineIcon fontSize='large' />;
            case 'Remaining Salary':
                return <AccountBalanceIcon fontSize='large' />;
            case 'Payment Due':
                return <ScheduleIcon fontSize='large' />;
            case 'Total Fine':
                return <GavelIcon fontSize='large' />;
            case 'Considered Fine':
                return <CheckCircleOutlineIcon fontSize='large' />;
            case 'Ignored Fine':
                return <DoDisturbIcon fontSize='large' />;
            case 'Remaining Fine':
                return <ProductionQuantityLimitsIcon fontSize='large' />;
            case 'Total Salary':
                return <AccountBalanceIcon fontSize='large' />;
            case 'Salary Paid':
                return <PaymentsIcon fontSize='large' />;
            case 'Advance Cut':
                return <ContentCutIcon fontSize='large' />;
            case 'Fine Cut':
                return <ContentCutIcon fontSize='large' />;
            case 'Total Credit':
                return <CreditScoreOutlinedIcon fontSize='large' />;
            case 'Total Bonus':
                return <RedeemIcon fontSize='large' />;

            // Expense/Transaction stats
            case 'Total Expense':
                return <ReceiptIcon fontSize='large' />;

            default:
                return <AssessmentIcon fontSize='large' />;
        }
    }
    return (
        <div className='countcard flex gap-4'>
            <div className='self-center'>
                <div className={`logoContainer ${props.color === 'blue' ? 'blueCountLogoWrp' : props.color === 'green' ? 'greenCountLogoWrp' : props.color === 'yellow' ? 'yellowCountLogoWrp' : props.color === 'pink' ? 'pinkCountLogoWrp' : props.color === 'black' ? 'blackCountLogoWrp' : props.color === 'orange' ? 'orangeCountLogoWrp' : props.color === 'red' ? 'redCountLogoWrp' : props.color === 'purple' ? 'purpleCountLogoWrp' : props.color === 'teal' ? 'tealCountLogoWrp' : props.color === 'indigo' ? 'indigoCountLogoWrp' : props.color === 'cyan' ? 'cyanCountLogoWrp' : ''}`}>
                    {getImg(props.desc)}
                </div>
            </div>
            <div className='self-center w-full'>
                <div className='countText'>
                    {props.count || 0}
                </div>
                <div className='countDescription'>
                    {props.desc}
                </div>
            </div>
        </div>
    )
}

export default SimpleCountCard;

