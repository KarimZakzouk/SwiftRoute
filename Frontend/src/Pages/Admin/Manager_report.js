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

const TotalProfitChart = () => {
  const [managerData, setManagerData] = useState([]); // Correct variable name for state

  useEffect(() => {
    axios
      .get("http://localhost:6969/report/manager-finances")
      .then((response) => {
        const data = response.data.data;
        if (data && data.length > 0) {
          const transformedData = data.map((item) => ({
            manager: item.manager,
            total_finance: item.total_finance,
          }));
          setManagerData(transformedData); // Correct state name here
        } else {
          setManagerData([]); // If no data, set empty array
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setManagerData([]); // If there is an error, set empty array
      });
  }, []);

  return (
    <div>
      <h2>Manager Net Profit</h2>

      {managerData.length > 0 ? (
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={managerData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="manager" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="total_finance" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <p>No data available</p>
      )}
    </div>
  );
};

export default TotalProfitChart;
