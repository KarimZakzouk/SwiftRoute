import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Link } from 'react-router-dom';

const columns = [
  { field: 'Stationid', headerName: 'ID', width: 90 },
  { field: 'StationName', headerName: 'Name', width: 150 },
  { field: 'Street', headerName: 'Street', width: 150 },
  { field: 'Zip', headerName: 'ZIP', width: 110 },
  { field: 'Governorate', headerName: 'Governorate', width: 130 },
  { field: 'm_ssn', headerName: 'Manager SSN', width: 150 }, // Added manager SSN column
];

export default function Stationgrid() {
  const [selectedRowIds, setSelectedRowIds] = useState([]);
  const [Rows, setRow] = useState([]);
  const [errorMessage, setErrorMessage] = useState(""); // Added for error message state
  const [successMessage, setSuccessMessage] = useState(""); // Added for success message state

  const handleSelectionChange = (newSelectionModel) => {
    setSelectedRowIds(newSelectionModel);
  };

  useEffect(() => {
    fetch('http://localhost:6969/admin/getStations')
      .then((response) => response.json())
      .then((data) => {
        const stations = data.data.map((station) => ({
          ...station,
          id: station.station_id, // Used for DataGrid internal IDs
          Stationid: station.station_id,
          StationName: station.station_name,
          Street: station.street,
          Zip: station.zipcode,
          Governorate: station.governorate,
          m_ssn: station.m_ssn || 'N/A',
        }));
        setRow(stations);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setErrorMessage('Failed to fetch stations data.');
      });
  }, []);

  const sendDataDeleteStation = async () => {
    const selectedStationIds = Rows.filter((row) => selectedRowIds.includes(row.id)).map(
      (row) => row.Stationid
    );

    if (selectedStationIds.length === 0) {
      setErrorMessage('No stations selected for deletion.');
      setSuccessMessage(''); // Clear success message when there's an error
      return;
    }

    const userConfirmed = window.confirm(
      `Are you sure you want to delete the selected station(s)? This action cannot be undone.`
    );

    if (!userConfirmed) {
      return;
    }

    const dataToSend = { stationIds: selectedStationIds };

    try {
      const response = await fetch('http://localhost:6969/admin/removeStation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });

      const result = await response.json();
      if (response.ok) {
        setSuccessMessage('Station(s) deleted successfully!');
        setErrorMessage('');
        setRow((prevRows) => prevRows.filter((row) => !selectedStationIds.includes(row.Stationid)));
        setSelectedRowIds([]);
      } else {
        setErrorMessage(result.message || 'Failed to delete station(s).');
        setSuccessMessage('');
      }
    } catch (error) {
      console.error('Error sending data:', error);
      setErrorMessage('Failed to delete station.');
      setSuccessMessage('');
    }
  };
  return (
    <div id="griddriv-container">
      <div id="data-grid-container" className="grid-container">
        <DataGrid
          id="data-grid"
          rows={Rows}
          columns={columns}
          pageSize={5}
          checkboxSelection
          onRowSelectionModelChange={(newSelectionModel) => handleSelectionChange(newSelectionModel)}
        />
      </div>

      <div id="selected-row-preview">
        <h3>Selected Station IDs:</h3>
        <pre>{JSON.stringify(selectedRowIds, null, 2)}</pre>
      </div>

      <div id="messages-container">
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        {successMessage && <p className="success-message">{successMessage}</p>}
      </div>

      <div id="button-container">
        <ul>
          <li className="button-item">
            <Link id="add-station-btn" className="button" to="/admin/stations/add">
              Add Station
            </Link>
          </li>
          <li className="button-item">
            <button className="button" id="delete-btn" onClick={sendDataDeleteStation}>
              Delete Station
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
}
