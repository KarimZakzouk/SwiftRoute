import './styles.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ManagerHome from './Pages/Manager/Home.js';
import ManagerTrips from './Pages/Manager/Trips.js';
import ManagerRequests from './Pages/Manager/Request.js';
import ManagerDrivers from './Pages/Manager/Drivers.js';
import Signup from './Pages/Signup.js';
import Login from './Pages/Login.js';
import ManagerAddTrip from './Pages/Manager/Add_Trip.js';
import AdminHome from './Pages/Admin/Profile.js';
import AdminAddStation from './Pages/Admin/Add_Station.js';
import AdminStations from './Pages/Admin/Stations.js';
import ManagerAddDriver from './Pages/Manager/Add_Driver.js';
import PrivateRoute from './PrivateRoute';
import ChangePassword from './Pages/ChangePassword';
import AdminRequests from './Pages/Admin/Request.js';
import CreateAdmin from './Pages/Admin/Create_Admin.js';
import NavBar1 from './Pages/Manager/Components/navbar.js';
// import ReactDOM from "./Pages/Driver/react-dom/client";
import "./Pages/Driver/index.css";
// import Driver from "./Pages/Driver/Driver";
import reportWebVitals from "./reportWebVitals";
import AllTrips from "./Pages/Driver/AllTrips";
import PrivateTrips from "./Pages/Driver/PrivateTrips";
import Reports from './Pages/Admin/Station_reports.js';                                     /////////////////////////////done
import DriverRep from './Pages/Admin/Driver_reports.js';
// import { Navbar } from "./Pages/Driver/react-bootstrap";

import PassengerReport from './Pages/Admin/Passenger_report.js';
import Profile from "./Pages/Driver/Components/Profile";
import ManagerReport from './Pages/Admin/Manager_report.js';
import LostStatus from"./Pages/Manager/LostStatus.js";
import PassengerHome from './Pages/Passenger/Components/Profile.js';
import PassengerProfile from './Pages/Passenger/Components/Profile.js';
import MyTrips from './Pages/Passenger/MyTrips.js';
import PassengerPrivateTrips from './Pages/Passenger/PrivateTrips.js';
// import PassengerTrips from './Pages/Passenger/Trips.js';
import RequestStatus from './Pages/Passenger/RequestStatus.js';
import PassengerTrips from './Pages/Passenger/AllTrips.js';
import Drivers from './Pages/Passenger/Components/Drivers.js';
// import Station from './Pages/Passenger/Components/Station.js';
import Station from './Pages/Station/StationHome.js';
import ManagerFnance from './Pages/Manager/Components/MangerFinance.js'
// import ProfileSettings from './Pages/Driver/Components/ProfileSettings.js';
import ProfileSettings from './Pages/ProfileSettings.js';
// import ChangeDriverPassword    from './Pages/Driver/Components/ChangeDriverPassword.js';
import ManegerialReport from './Pages/Admin/Manegerial_report.js';
// import Profile_Settings from './Pages/Manager/Profile_Settings.js';
import DetailedReport from './Pages/Admin/Detaiel_report.js'
import Resigns from './Pages/Manager/Resigns.js';
import HireManager from './Pages/Admin/Components/HireManager.js';


function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
{/* 
          <Route path="/bulk" element={<RegisterPage />} /> */}

          <Route path="/signup" element={<Signup />} />

          <Route element={<PrivateRoute requiredRole="Admin" />}>
            <Route path="/admin" element={<AdminHome />} />
            <Route path="/admin/stations/add" element={<AdminAddStation />} />
            <Route path="/admin/stations" element={<AdminStations />} />
            <Route path="/admin/requests" element={<AdminRequests />} />
            <Route path="/admin/create-admin" element={<CreateAdmin />} />
            <Route path="/admin/ChangePassword" element={<ChangePassword/>} />
            <Route path="/admin/ProfileSettings" element={<ProfileSettings/>} />
            <Route path="/admin/Reports" element={<Reports/>} />
            <Route path="/admin/Reports/Drivers" element={<DriverRep/>} />
            <Route path="/admin/Reports/Managers" element={<ManagerReport/>} />
            <Route path="/admin/Reports/Passengers" element={<PassengerReport/>} />
            <Route path="/admin/Reports/Managerial" element={<ManegerialReport/>} />
            <Route path="/admin/Reports/Detailed" element={<DetailedReport/>} />
            <Route path="/admin/hireManagers" element={<HireManager/>} />
          </Route>

          <Route element={<PrivateRoute requiredRole="Manager" />}>
            <Route path="manager" element={<ManagerHome />} />
            <Route path="manager/drivers/add" element={<ManagerAddDriver />} />
            <Route path="manager/trips/add" element={<ManagerAddTrip />} />
            <Route path="manager/drivers" element={<ManagerDrivers />} />
            <Route path="manager/trips" element={<ManagerTrips />} />
            <Route path="manager/requests" element={<ManagerRequests />} />
            <Route path="manager/manager-finance" element={<ManagerFnance />} />
            <Route path="manager/ProfileSettings" element={<ProfileSettings />} />
            <Route path="manager/ChangePassword" element={<ChangePassword/>} />
            <Route path="manager/LostStatus" element={<LostStatus/>} />
            <Route path="manager/Driver" element={<Drivers/>} />
            <Route path="manager/Station" element={<Station/>} />
            <Route path="manager/Resigns" element={<Resigns/>} />
            
          </Route>


          <Route element={<PrivateRoute requiredRole="Driver" />}>
            <Route path="Driver" element={<Profile />} />
            {/* <Route path="Driver/Profile" element={<Profile />} /> */}
            <Route path="Driver/Trips" element={<AllTrips />} />
            <Route path="Driver/PrivateTrips" element={<PrivateTrips />} />
            <Route path="Driver/ProfileSettings" element={<ProfileSettings/>} />
            <Route path="Driver/ChangePassword" element={<ChangePassword/>} />
      
          </Route>


          <Route element={<PrivateRoute requiredRole="Passenger" />}>
            <Route path="Passenger" element={<PassengerHome />} />
            <Route path="Passenger/Profile" element={<PassengerProfile />} />
            <Route path="Passenger/MyTrips" element={<MyTrips />} />
            <Route path="Passenger/PrivateTrips" element={<PassengerPrivateTrips />} />
            <Route path="Passenger/RequestTrips" element={<PassengerTrips />} />
            <Route path="Passenger/Drivers" element={<Drivers />} />
            <Route path="Passenger/Station" element={<Station/>} />
            <Route path="Passenger/ChangePassword" element={<ChangePassword/>} />
            <Route path="Passenger/ProfileSettings" element={<ProfileSettings/>} />
            <Route path="Passenger/RequestStatus" element={<RequestStatus/>} />
            
          </Route>




          {/* <Route element={<PrivateRoute requiredRole="Driver" />}>
            <Route path="Driver" element={<Home />} />
            <Route path="Driver/Profile" element={<Profile />} />
            <Route path="Driver/LogOut" element={<LogOut />} />
            <Route path="Driver/Trips" element={<AllTrips />} />
            <Route path="Driver/PrivateTrips" element={<PrivateTrips />} />
            <Route path="manager/requests" element={<ManagerRequests />} />
          </Route> */}


           {/* <Route path="/" element={<Layout />}>
           <Route index element={<Home />} />
         <Route path="Profile" element={<Profile />} />
           <Route path="LogOut" element={<LogOut />} />
          <Route path="Trips" element={<AllTrips />} />
           <Route path="PrivateTrips" element={<PrivateTrips />} /> */}


          <Route path="/change-password" element={<ChangePassword />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
