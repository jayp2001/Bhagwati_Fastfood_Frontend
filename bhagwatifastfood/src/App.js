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
function App() {
  return (
    <div className="">
      <BrowserRouter>
       <NavBar/>
            <Routes>
              {/* <Route path="/" element={<ProtectedAdminRoute/>}>
                <Route path='add' exact element={<AddAdminPage />}/>
                <Route path='list' exact element={<AgentList />}/>
              </Route> */}
              <Route path="/" element={<ProtectedUserRoutes/>}>
                <Route path="/dashboard" element={<Dashboard/>}/>
                <Route path="/addUser" element={<AddUser />}/>
                <Route path="/addSuppiler" element={<AddSuppiler />}/>
                <Route path="/userTable" element={<UserTable />}/>
                <Route path="/productList" element={<ProductList />}/>
                <Route path="/stockInOut" element={<StockInOut />}/>
                <Route path="/suppilerTable" element={<SuppilerTable />}/>
                <Route path="/categories" element={<CategoriesTable />}/>
                <Route path="/editUser/:id" element={<EditUser/>}/>
                <Route path="/editSuppiler/:id" element={<EditSuppiler/>}/>
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
    </BrowserRouter>
    </div>
  );
}

export default App;
