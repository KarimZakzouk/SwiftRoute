import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const Passenger_rep = () => {
  const [avgAge, setAvgAge] = useState(null);
  const [passengerTripsData, setPassengerTripsData] = useState([]);
  const [passengerSpentData, setPassengerSpentData] = useState([]);

  useEffect(() => {
    // Fetch average age data
    axios
      .get("http://localhost:6969/report/passenger-average-age")
      .then((response) => {
        const data = response.data;
        if (data && data.average_age !== undefined) {
          setAvgAge(data.average_age);
        } else {
          setAvgAge(null); // Set null if no average age data
        }
      })
      .catch((error) => {
        console.error("Error fetching passenger age data:", error);
      });

    // Fetch passenger trips data
    axios
      .get("http://localhost:6969/report/passenger-trips")
      .then((response) => {
        const data = response.data.data; // Ensure this matches the actual API structure
        if (data && data.length > 0) {
          const processedData = data.map((item) => ({
            passenger_name: item.passenger, // Ensure 'passenger' matches your API response key
            no_of_trips: parseInt(item.trips, 10), // Convert to integer
          }));
          setPassengerTripsData(processedData);
        } else {
          setPassengerTripsData([]); // Set empty array if no data
        }
      })
      .catch((error) => {
        console.error("Error fetching passenger trips data:", error);
      });

    // Fetch passenger spending data
    axios
      .get("http://localhost:6969/report/passenger-expence")
      .then((response) => {
        const data = response.data.data; // Ensure this matches the actual API structure
        if (data && data.length > 0) {
          const processedData = data.map((item) => ({
            passenger_name: item.passenger, // Ensure 'passenger_name' matches your API response key
            total_spent: parseFloat(item.total_expense), // Convert to float for consistent numeric representation
          }));
          setPassengerSpentData(processedData);
        } else {
          setPassengerSpentData([]); // Set empty array if no data
        }
      })
      .catch((error) => {
        console.error("Error fetching passenger spending data:", error);
      });
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Average Age</h2>
      {avgAge !== null ? (
        <div
          style={{
            padding: "20px",
            border: "1px solid #ccc",
            borderRadius: "5px",
            backgroundColor: "#f9f9f9",
            fontSize: "24px",
            fontWeight: "bold",
            display: "inline-block",
            marginBottom: "20px",
          }}
        >
          {avgAge} years
        </div>
      ) : (
        <p>No data available</p>
      )}

      <h2>Passenger Trips</h2>
      {passengerTripsData.length > 0 ? (
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={passengerTripsData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="passenger_name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="no_of_trips" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <p>No data available</p>
      )}

      <h2>Passenger Spending</h2>
      {passengerSpentData.length > 0 ? (
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={passengerSpentData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="passenger_name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="total_spent" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <p>No data available</p>
      )}
    </div>
  );
};

export default Passenger_rep;
