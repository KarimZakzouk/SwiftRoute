import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";

const ManagerialReport = () => {
  const [userCounts, setUserCounts] = useState([]);
  const [managerData, setManagerData] = useState([]);
  const [driverData, setDriverData] = useState([]);

  // Fetch data on mount
  useEffect(() => {
    // Fetch user count data
    axios
      .get("http://localhost:6969/report/count_all")
      .then((response) => {
        const data = response.data;
        //console.log(data);
        if (data) {
          setUserCounts([
            { name: "Drivers", value: parseInt(data.driver, 10) },
            { name: "Managers", value: parseInt(data.manager, 10) },
            { name: "Passengers", value: parseInt(data.passenger, 10) },
          ]);
        }
      })
      .catch((error) => {
        console.error("Error fetching user count data:", error);
      });

    axios
      .get("http://localhost:6969/report/managers_per_location")
      .then((response) => {
        const data = response.data.data;
        //console.log(data);
        if (Array.isArray(data) && data.length > 0) {
          setManagerData(
            data.map((item) => ({
              location: item.governorate,
              managers: parseInt(item.managerscount, 10), // Ensure numeric consistency
            }))
          );
        }
      })
      .catch((error) => {
        console.error("Error fetching manager data by location:", error);
      });

    // Fetch drivers per location
    axios
      .get("http://localhost:6969/report/drivers_per_location")
      .then((response) => {
        const data = response.data.data;
        console.log(response);
        if (Array.isArray(data) && data.length > 0) {
          setDriverData(
            data.map((item) => ({
              location: item.governorate,
              drivers: parseInt(item.driverscount, 10), // Ensure numeric consistency
            }))
          );
        }
      })
      .catch((error) => {
        console.error("Error fetching driver data by location:", error);
      });
  }, []);

  const COLORS = ["#8884d8", "#82ca9d", "#ffc658"]; // Colors for the pie chart

  return (
    <div style={{ padding: "20px" }}>
      {/* User Distribution Section */}
      <h2>User Distribution</h2>
      {userCounts.length > 0 ? (
        <ResponsiveContainer width="100%" height={400}>
          <PieChart>
            <Pie
              data={userCounts}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={150}
              fill="#8884d8"
              label
            >
              {userCounts.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <p>No data available</p>
      )}

      {/* Managers Per Location Section */}
      <h2>Number of Managers by Location</h2>
      {managerData.length > 0 ? (
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={managerData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="location" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="managers" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <p>No data available</p>
      )}

      {/* Drivers Per Location Section */}
      <h2>Number of Drivers by Location</h2>
      {driverData.length > 0 ? (
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={driverData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="location" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="drivers" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <p>No data available</p>
      )}
    </div>
  );
};

export default ManagerialReport;
