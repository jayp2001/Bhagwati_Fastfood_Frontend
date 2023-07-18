import logo from './logo.svg';
import './App.css';
import PageNotFoundRedirect from "./pageNotFound";
import { BrowserRouter ,Route,Routes } from "react-router-dom";
import LoginPage from './pages/login/login';
import Dashboard from './pages/inventory/dashboard/dashboard';
import ProtectedUserRoutes from './protectedUserRoutes';
import NavBar from './pages/navBar/nav';
import AddUser from './pages/users/addUser/addUser'
import UserTable from './pages/users/userTable/userTable';
import EditUser from './pages/users/editUser/editUser';
import AddSuppiler from './pages/inventory/addSuppiler/addSuppiler';
import SuppilerTable from './pages/inventory/suppilerTable/suppilerTable';
import EditSuppiler from './pages/inventory/editSuppiler/editSuppiler';
import ProductList from './pages/inventory/product/productList';
import CategoriesTable from './pages/inventory/categoriesTable/categoriesTable';
import StockInOut from './pages/inventory/stockManagement/stockInOut';
import TransactionTable from './pages/inventory/transactionTable/transactionTable';
import SuppilerDetail from './pages/inventory/suppilerDetails/suppilerDetail';
import ProductDetails from './pages/inventory/productDetails/productDetails';
import ProductListTable from './pages/inventory/productListTable/productListTable';
import 'react-toastify/dist/ReactToastify.css';
import EditHistory from './pages/inventory/editHistory/editHistory';
import StockOut from './pages/inventory/stockOut/stockOut';
import ProtectedStockManagerRoutes from './protectedStockManageRoutes';
function App() {
  return (
    <div className="">
      <BrowserRouter>
       <NavBar/>
            <div className='mainBody'>
              <Routes>
                <Route path="/" element={<ProtectedStockManagerRoutes/>}>
                  <Route path="/stockOut" element={<StockOut />}/>
                  {/* <Route path='list' exact element={<AgentList />}/> */}
                  <Route path='*' element={<PageNotFoundRedirect/>}/>
                </Route>
                <Route path="/" element={<ProtectedUserRoutes/>}>
                  <Route path="/dashboard" element={<Dashboard/>}/>
                  <Route path="/addUser" element={<AddUser />}/>
                  <Route path="/addSuppiler" element={<AddSuppiler />}/>
                  <Route path="/userTable" element={<UserTable />}/>
                  <Route path="/productList" element={<ProductList />}/>
                  <Route path="/productTable" element={<ProductListTable />}/>
                  <Route path="/stockInOut" element={<StockInOut />}/>
                  <Route path="/transactionTable" element={<TransactionTable />}/>
                  <Route path="/suppilerTable" element={<SuppilerTable />}/>
                  <Route path="/categories" element={<CategoriesTable />}/>
                  <Route path="/editUser/:id" element={<EditUser/>}/>
                  <Route path="/editHistory/:id" element={<EditHistory/>}/>
                  <Route path="/editSuppiler/:id" element={<EditSuppiler/>}/>
                  <Route path="/suppilerDetails/:id" element={<SuppilerDetail/>}/>
                  <Route path="/productDetails/:id/:name/:unit/:remainingQty" element={<ProductDetails/>}/>
                  {/* <Route path="/dashboard" element={<Dashboard/>}/>
                  <Route path="/dealer/:id" element={<DealerDetail/>}/>
                  <Route path="/editDealer/:id" element={<EditDealer/>}/>
                  <Route path="/vehicleDetail/:id" element={<VehicleDetail/>}/>
                  <Route path="/editVehicleDetail/:id" element={<EditBook/>}/>
                  <Route path="/TTO" element={<TtoBookList/>}/>
                  <Route path="/RRF" element={<RrfBookList/>}/>
                  <Route path="/OTHER" element={<OtherBookList/>}/>
                  <Route path="/bookList" element={<AllBookList/>}/> */}
                </Route>
                <Route path='/login' exact element={<LoginPage />}/>
                <Route path='*' element={<PageNotFoundRedirect/>}/>
              </Routes>
            </div>
    </BrowserRouter>
    </div>
  );
}

export default App;
