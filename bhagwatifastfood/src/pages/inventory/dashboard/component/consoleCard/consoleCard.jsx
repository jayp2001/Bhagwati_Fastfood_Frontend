import './consoleCard.css'
import deliveryBoyLogo from '../../../../../assets/deliveryBoy.svg'
import bhagwatiLogo from '../../../../../assets/bhagwatiLogo.png'
function ConsoleCard(props) {
    const getImg = (imgname) => {
        switch (imgname) {
            case 'deliveryBoyLogo':
                return deliveryBoyLogo;
            default:
                return bhagwatiLogo;
        }
    }
    return (
        <div className='consoleCard'>
            <div className='consoleLogo flex justify-center'>
                <img src={getImg(props.imgName)} alt='delivery boy' />
            </div>
            <div className='consoleName'>
                {props.name}
            </div>
        </div>
    )
}

export default ConsoleCard;

