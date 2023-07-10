import './countCard.css';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';

function CountCard(props) {
    return (
        <div className='countcard flex gap-4'>
            <div className='self-center'>
                <div className={`logoContainer ${props.color === 'blue' ? 'blueCountLogoWrp' : props.color === 'green' ? 'greenCountLogoWrp' : props.color === 'yellow' ? 'yellowCountLogoWrp' : props.color === 'pink' ? 'pinkCountLogoWrp' : props.color === 'black' ? 'blackCountLogoWrp' : props.color === 'orange' ? 'orangeCountLogoWrp' : ''}`}>

                </div>
            </div>
            <div className='self-center w-full'>
                <div className='countText'>
                    <span>{props.productDetail ? props.unitDesc === 0 ? <CurrencyRupeeIcon fontSize='large' /> : '' : ''}</span> {props.count} <span className='unitDisplay'>{props.productDetail ? props.unitDesc !== 0 ? props.unitDesc : '' : ''}</span>
                </div>
                <div className='countDescription'>
                    {props.desc}
                </div>
            </div>
        </div>
    )
}

export default CountCard;