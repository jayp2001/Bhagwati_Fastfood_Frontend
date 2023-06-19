import logo from './logo.svg';
import './App.css';
import PageNotFoundRedirect from "./pageNotFound";
import { BrowserRouter ,Route,Routes } from "react-router-dom";
import LoginPage from './pages/login/login';
import Dashboard from './pages/inventory/dashboard/dashboard';
import ProtectedUserRoutes from './protectedUserRoutes';
import NavBar from './pages/navBar/nav';
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
                {/* <Route path="/addBook" element={<AddBook/>}/>
                <Route path="/dashboard" element={<Dashboard/>}/>
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
