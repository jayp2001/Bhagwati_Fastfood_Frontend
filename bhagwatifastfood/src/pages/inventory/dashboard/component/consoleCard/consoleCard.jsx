import './consoleCard.css'
import deliveryBoyLogo from '../../../../../assets/deliveryBoy.svg'
import bhagwatiLogo from '../../../../../assets/bhagwatiLogo.png';
import img11 from '../../../../../assets/img11.png';
import userAdd from '../../../../../assets/userAdd.png';
import staff from '../../../../../assets/staff2.png';
import expense from '../../../../../assets/expense.png';
import userList from '../../../../../assets/userList.png';
import bank from '../../../../../assets/bank.png';
import report from '../../../../../assets/report.png';
import hotel from '../../../../../assets/billing/hotel.png'
import scoreboard from '../../../../../assets/billing/scoreboard.png';
import delivery from '../../../../../assets/billing/delivery.png';
import mobileView from '../../../../../assets/billing/smartphone.png'
import deliveryMen from '../../../../../assets/billing/express.png'
function ConsoleCard(props) {
    const getImg = (imgname) => {
        switch (imgname) {
            case 'img11':
                return img11;
            case 'staff':
                return staff;
            case 'expense':
                return expense;
            case 'userList':
                return userList;
            case 'bank':
                return bank;
            case 'report':
                return report;
            case 'scoreboard':
                return scoreboard;
            case 'delivery':
                return delivery;
            case 'hotel':
                return hotel;
            case 'mobileView':
                return mobileView;
            case 'deliveryMen':
                return deliveryMen;
            default:
                return userAdd;
        }
    }
    return (
        <div className='consoleCard' onClick={() => props.goToAddUSer()}>
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

