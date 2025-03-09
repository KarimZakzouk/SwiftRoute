import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { Outlet } from "react-router-dom";
import AdminNavbar from "./Pages/Admin/Components/navbar";
import ManagerNavbar from "./Pages/Manager/Components/navbar";
import DriverNavbar from "./Pages/Driver/NavBar";
import PassengerNavBar from "./Pages/Passenger/NavBar";
const PrivateRoute = ({ element: Component, requiredRole, ...rest }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const ssn = sessionStorage.getItem("ssn");
    const userType = sessionStorage.getItem("userType");

    if (ssn && userType) {
      setIsAuthenticated(true);
      setUserRole(userType);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  if (isAuthenticated === null) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated || userRole !== requiredRole) {
    return <Navigate to="/" />;
  }

  const renderNavbar = () => {
    switch (userRole) {
      case "Admin":
        return <AdminNavbar />;
      case "Manager":
        return <ManagerNavbar />;
      case "Driver":
        return <DriverNavbar />;
        case 'Passenger':
        return <PassengerNavBar/>;
      default:
        return null;
    }
  };

  return (
    <div style={{ width: "100%", height: "100%" }}>
      {renderNavbar()}
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default PrivateRoute;
