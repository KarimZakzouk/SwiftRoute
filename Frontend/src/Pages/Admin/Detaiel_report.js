import React, { useState, useEffect } from "react";
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid";
import { Paper, Box, CircularProgress, Typography } from "@mui/material";

const DriversTable = () => {
  const [driversData, setDriversData] = useState([]);
  const [passengerData, setPassengerData] = useState([]);
  const [managersData, setManagersData] = useState([]);
  const [loading, setLoading] = useState(true); // State for loading
  const [error, setError] = useState(null); // State for error

  // Fetch data from the backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Drivers Data
        const driverResponse = await axios.get(
          "http://localhost:6969/report/driver-details"
        );
        const driverData = driverResponse.data.data;
        if (Array.isArray(driverData)) {
          setDriversData(
            driverData.map((driver, index) => ({
              id: index, // Use index as the unique id
              name: driver.driver_name,
              tripsCompleted: parseInt(driver.trips_completed, 10),
              avgTripDuration: driver.avg_trip_duration,
              avgRating: parseFloat(driver.avg_rating).toFixed(1),
            }))
          );
        }

        // Fetch Passenger Data
        const passengerResponse = await axios.get(
          "http://localhost:6969/report/passenger-details"
        );
        const passengerData = passengerResponse.data.data;
        if (Array.isArray(passengerData)) {
          setPassengerData(
            passengerData.map((item, index) => ({
              id: index, // Use index as the unique id
              name: item.passenger_name,
              bookings: parseInt(item.trips_made, 10),
              amountSpent: item.total_amount_spent,
              frequentDestination: item.most_frequent_destination,
            }))
          );
        }

        // Fetch Manager Data
        const managerResponse = await axios.get(
          "http://localhost:6969/report/manager-details"
        );
        const managerData = managerResponse.data.data;
        if (Array.isArray(managerData)) {
          setManagersData(
            managerData.map((manager, index) => ({
              id: index, // Use index as the unique id
              name: manager.manager_name,
              tripsCount: parseInt(manager.trips_managed, 10),
              driverCount: parseInt(manager.drivers_managed, 10),
              avgDriverRating: parseFloat(manager.avg_driver_rating).toFixed(2),
            }))
          );
        }

        setLoading(false); // Set loading to false after data is fetched
      } catch (err) {
        setError("Error fetching data from the server.");
        setLoading(false); // Set loading to false in case of error
      }
    };

    fetchData();
  }, []);

  // Define columns for DataGrid
  const passengerColumns = [
    { field: "name", headerName: "Passenger Name", flex: 1 },
    { field: "bookings", headerName: "Bookings Made", flex: 1 },
    { field: "amountSpent", headerName: "Total Amount Spent", flex: 1 },
    {
      field: "frequentDestination",
      headerName: "Most Frequent Destination",
      flex: 1,
    },
  ];

  const driverColumns = [
    { field: "name", headerName: "Driver Name", flex: 1 },
    { field: "tripsCompleted", headerName: "Trips Completed", flex: 1 },
    { field: "avgTripDuration", headerName: "Avg Trip Duration", flex: 1 },
    { field: "avgRating", headerName: "Avg Rating", flex: 1 },
  ];

  const managerColumns = [
    { field: "name", headerName: "Manager Name", flex: 1 },
    { field: "tripsCount", headerName: "Trips Managed", flex: 1 },
    { field: "driverCount", headerName: "Drivers Managed", flex: 1 },
    { field: "avgDriverRating", headerName: "Avg Driver Rating", flex: 1 },
  ];

  if (loading) {
    return (
      <Box
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box style={{ textAlign: "center", padding: "20px" }}>
        <Typography variant="h5" color="error">
          {error}
        </Typography>
      </Box>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <h2 style={{ marginLeft: "30px" }}>Passenger Details</h2>
      <Box style={{ flex: 1, marginBottom: "20px", overflow: "auto" }}>
        <Paper elevation={3} style={{ padding: "20px" }}>
          <div style={{ height: 300, width: "100%" }}>
            <DataGrid
              rows={passengerData}
              columns={passengerColumns}
              pageSize={5}
              rowsPerPageOptions={[5]}
              disableSelectionOnClick
              autoHeight
              headerHeight={50}
              hideFooter
            />
          </div>
        </Paper>
      </Box>

      <h2 style={{ marginLeft: "30px" }}>Driver Details</h2>
      <Box style={{ flex: 1, marginBottom: "20px", overflow: "auto" }}>
        <Paper elevation={3} style={{ padding: "20px" }}>
          <div style={{ height: 300, width: "100%" }}>
            <DataGrid
              rows={driversData}
              columns={driverColumns}
              pageSize={5}
              rowsPerPageOptions={[5]}
              disableSelectionOnClick
              autoHeight
              headerHeight={50} // Fixed header height
              hideFooter
            />
          </div>
        </Paper>
      </Box>

      <h2 style={{ marginLeft: "30px" }}>Manager Details</h2>
      <Box style={{ flex: 1, overflow: "auto" }}>
        <Paper elevation={3} style={{ padding: "20px" }}>
          <div style={{ height: 300, width: "100%" }}>
            <DataGrid
              rows={managersData}
              columns={managerColumns}
              pageSize={12}
              rowsPerPageOptions={[5]}
              disableSelectionOnClick
              autoHeight
              headerHeight={50} // Fixed header height
              hideFooter
            />
          </div>
        </Paper>
      </Box>
    </div>
  );
};

export default DriversTable;
