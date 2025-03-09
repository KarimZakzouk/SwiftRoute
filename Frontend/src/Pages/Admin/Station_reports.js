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

const Station_report = () => {
  const [stationTripsData, setStationTripsData] = useState([]);
  const [stationRatingsData, setStationRatingsData] = useState([]);
  const [stationSalaryData, setStationSalaryData] = useState([]);
  const [mostVisitedStations, setMostVisitedStations] = useState([]); // Changed to handle multiple stations

  useEffect(() => {
    axios
      .get("http://localhost:6969/report/trips-per-station")
      .then((response) => {
        const data = response.data.data;
        if (data && data.length > 0) {
          const transformedData = data.map((item) => ({
            station: item.station, //
            trips: item.trips, //
          }));
          setStationTripsData(transformedData);
        }
      })
      .catch((error) => {
        console.error("Error fetching station trips data:", error);
      });

    axios
      .get("http://localhost:6969/report/station-rate")
      .then((response) => {
        const data = response.data.data;
        if (data && data.length > 0) {
          const transformedData = data.map((item) => ({
            station: item.station, //
            rating: item.rating, //
          }));
          setStationRatingsData(transformedData);
        }
      })
      .catch((error) => {
        console.error("Error fetching station ratings data:", error);
      });

    axios
      .get("http://localhost:6969/report/average-station-salary")
      .then((response) => {
        const data = response.data.data;
        console.log(response);
        if (data && data.length > 0) {
          const processedData = data.map((item) => ({
            station_name: item.station_name, ////
            avg_salary: parseFloat(item.avg_salary), // Ensure it's a number
          }));
          setStationSalaryData(processedData);
        }
      })
      .catch((error) => {
        console.error("Error fetching station salary data:", error);
      });

    axios
      .get("http://localhost:6969/report/most-destination-station")
      .then((response) => {
        const data = response.data.data;
        if (data && data.length > 0) {
          const processedData = data.map((item) => ({
            station_name: item.station_name, ////
            visits: parseFloat(item.visit_count), // Ensure it's a number
          }));
          setMostVisitedStations(processedData);
        }
      })
      .catch((error) => {
        console.error("Error fetching most visited station data:", error);
      });
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ textAlign: "center" }}>Station Trips per Month</h2>
      {stationTripsData.length > 0 ? (
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={stationTripsData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="station" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="trips" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <p style={{ textAlign: "center" }}>No data available</p>
      )}

      <h2 style={{ textAlign: "center", marginTop: "40px" }}>
        Station Ratings
      </h2>
      {stationRatingsData.length > 0 ? (
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={stationRatingsData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="station" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="rating" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <p style={{ textAlign: "center" }}> No data available</p>
      )}

      <h2>Station Average Salary</h2>
      {stationSalaryData.length > 0 ? (
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={stationSalaryData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="station_name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="avg_salary" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <p style={{ textAlign: "center" }}>No data available</p>
      )}

      <h2>Most Visited Stations</h2>
      {mostVisitedStations.length > 0 ? (
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={mostVisitedStations}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="station_name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="visits" fill="#ff7300" />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <p style={{ textAlign: "center" }}>No data available</p>
      )}
    </div>
  );
};

export default Station_report;
