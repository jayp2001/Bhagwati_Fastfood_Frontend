import './consoleCard.css'
import deliveryBoyLogo from '../../../../../assets/deliveryBoy.svg'
function ConsoleCard() {
    return (
        <div className='consoleCard'>
            <div className='consoleLogo flex justify-center'>
                <img src={deliveryBoyLogo} alt='delivery boy' />
            </div>
            <div className='consoleName'>
                Inventory
            </div>
        </div>
    )
}

export default ConsoleCard;

