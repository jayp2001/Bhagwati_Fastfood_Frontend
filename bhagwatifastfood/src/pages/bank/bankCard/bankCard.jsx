import './bankCard.css'
import deliveryBoyLogo from '../../../assets/deliveryBoy.svg'
import bhagwatiLogo from '../../../assets/bhagwatiLogo.png';
import img11 from '../../../assets/img11.png';
import userAdd from '../../../assets/userAdd.png';
import staff from '../../../assets/staff2.png';
import expense from '../../../assets/expense.png';
import userList from '../../../assets/userList.png';
function BankCard(props) {
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
            default:
                return userAdd;
        }
    }
    return (
        <div className='CategoryCard' onClick={() => props.goToBank(props.data.bankId)} key={props.data.bankId}>
            <div className='h-3/4 flex w-full'>
                <div className='CategoryLogo flex justify-center'>
                    <img src={getImg(props.imgName)} alt='delivery boy' />
                </div>
                <div className='statacticsDisplayBlock'>
                    <div className='statacticsDisplayHeader'>
                        Available Balance
                    </div>
                    <div className='statacticsDisplayDisplay'>
                        {parseFloat(props.data.availableBalance).toLocaleString('en-IN')}
                    </div>
                </div>
            </div>
            <div className='consoleName'>
                {props.name}
            </div>
        </div>
    )
}

export default BankCard;

