import React, { useState, useEffect } from 'react';
import Nav1 from './Components/navbar.js';
import axios from "axios";

export default function AddTrip() {
  const [forminput, setforminput] = useState({
    destination_station: "",
    price: ""
  });
  const userssn = sessionStorage.getItem('ssn');

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const sendData = async () => {
    try {
      const currentDateTime = new Date().toISOString();

      const payload = {
        destination_station: forminput.destination_station,
        price: forminput.price,
        m_ssn: userssn,
        date: currentDateTime
      };

      const response = await fetch('http://localhost:6969/manager/create-trips', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      console.log('Response from server:', result);

      if (result.success) {
        setSuccessMessage('Trip added successfully!');
        setErrorMessage('');
      } else {
        setErrorMessage('Error: Could not add the trip.');
        setSuccessMessage('');
      }
    } catch (error) {
      console.error('Error sending data:', error);
      setErrorMessage('An error occurred while adding the trip.');
      setSuccessMessage('');
    }
  };

  const [destinationStations, setDestinationStations] = useState([]);

  useEffect(() => {
    axios
      .post("http://localhost:6969/manager/stations", { m_ssn: userssn })
      .then((response) => {
        if (Array.isArray(response.data.data)) {
          setDestinationStations(response.data.data);
        } else {
          console.error("Unexpected response format:", response.data);
        }
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, [userssn]);

  return (
    <div>
      <h2 id="site_Title">Add Trip</h2>
      <div id="Addtrip">
        <form id="Addtrip_box">
          <div id="combobox-container">
            <label htmlFor="styled-combobox">Destination</label>
            <select
              id="styled-combobox"
              className='margin-right'
              value={forminput.destination_station}
              onChange={(event) =>
                setforminput({ ...forminput, destination_station: event.target.value })
              }
            >
              <option value="">-- Select Destination --</option>
              {destinationStations.map((station) => (
                <option key={station.station_id} value={station.station_id}>
                  {station.station_name}
                </option>
              ))}
            </select>
          </div>

          <div id="input-container">
            <label htmlFor="price">Price</label>
            <input
              id="price"
              value={forminput.price}
              type="number"
              onChange={(event) => {
                const value = event.target.value;
                if (value >= 0 || value === "") {
                  setforminput({ ...forminput, price: value });
                }
              }}
              step="0.1"
              min="0"
            />
          </div>

          {successMessage && (
            <div style={{ color: 'green', fontSize: '14px', marginTop: '10px' }}>
              {successMessage}
            </div>
          )}

          {errorMessage && (
            <div style={{ color: 'red', fontSize: '14px', marginTop: '10px' }}>
              {errorMessage}
            </div>
          )}

          <button
            id="button"
            type="button"
            onClick={sendData}
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}
