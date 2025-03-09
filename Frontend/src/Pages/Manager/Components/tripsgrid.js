import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import "./styles.css";
import axios from "axios";

const columns = [
  { field: "id", headerName: "Trip ID", width: 90 },
  { field: "Driver", headerName: "Driver Name", width: 150 },
  { field: "Source", headerName: "Source Station", width: 150 },
  { field: "Destination", headerName: "Destination Station", width: 150 },
  { field: "Price", headerName: "Price", width: 150 },
  { field: "EstimatedTime", headerName: "Estimated Time (mins)", width: 150 },
];

export default function Tripslist() {
  const [selectedRowIds, setSelectedRowIds] = useState([]);
  const [rows, setRows] = useState([]);
  const [newPrice, setNewPrice] = useState('');
  const userssn = sessionStorage.getItem('ssn');
  const [newdriver, setDriver] = useState("");
  const [newDest, setNewDest] = useState("");
  const [newDestName, setNewDestName] = useState("");
  const [DriverStation, setDriverStations] = useState([]);

  const [statusMessage, setStatusMessage] = useState({
    message: '',
    type: '',
  });

  const handleSelectionChange = (newSelectionModel) => {
    setSelectedRowIds(newSelectionModel);
  };

  const handlePriceChange = (event) => {
    setNewPrice(event.target.value);
  };

  const updatePrice = async () => {
    if (selectedRowIds.length === 0) {
      setStatusMessage({
        message: "Please select at least one trip to update the price.",
        type: "error",
      });
      return;
    }

    if (!newPrice || isNaN(newPrice) || newPrice <= 0) {
      setStatusMessage({
        message: "Please enter a valid price.",
        type: "error",
      });
      return;
    }

    const updatedTrips = selectedRowIds.map((id) => {
      const trip = rows.find((row) => row.id === id);
      return { trip_id: trip.id, new_price: newPrice };
    });

    try {
      const response = await fetch(
        "http://localhost:6969/manager/update-price",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            trips: updatedTrips,
          }),
        }
      );

      const data = await response.json();
      if (data.success) {
        setRows((prevRows) =>
          prevRows.map((row) =>
            selectedRowIds.includes(row.id) ? { ...row, Price: newPrice } : row
          )
        );
        setStatusMessage({
          message: "Price updated successfully.",
          type: "success",
        });
      } else {
        setStatusMessage({
          message: "Error updating price.",
          type: "error",
        });
      }
    } catch (error) {
      console.error("Error updating price:", error);
      setStatusMessage({
        message: "An error occurred while updating the price.",
        type: "error",
      });
    }
  };

  const handleDestChange = (event) => {
    setNewDest(event.target.value); // Store the destination id directly
    setNewDestName(event.target.options[event.target.selectedIndex].text); // Store the destination name
  };

  const updateDest = async () => {
    if (selectedRowIds.length === 0) {
      setStatusMessage({
        message: "Please select at least one trip to update the Dest.",
        type: "error",
      });
      return;
    }

    if (!newDest || newDest <= 0) {
      setStatusMessage({
        message: "Please select a valid Destination.",
        type: "error",
      });
      return;
    }

    const updatedTrips = selectedRowIds.map((id) => {
      const trip = rows.find((row) => row.id === id);
      return { trip_id: trip.id, new_destination: newDest };
    });

    try {
      const response = await fetch(
        "http://localhost:6969/manager/update-destination",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            trips: updatedTrips,
          }),
        }
      );
      const data = await response.json();
      if (data.success) {
        setRows((prevRows) =>
          prevRows.map((row) =>
            selectedRowIds.includes(row.id)
              ? { ...row, Destination: newDestName }
              : row
          )
        );
        setStatusMessage({
          message: "Destination updated successfully.",
          type: "success",
        });
      } else {
        setStatusMessage({
          message: "Error updating Destination.",
          type: "error",
        });
      }
    } catch (error) {
      console.error("Error updating Destination:", error);
      setStatusMessage({
        message: "An error occurred while updating the Destination.",
        type: "error",
      });
    }
  };

  const handleDriverChange = (event) => {
    setDriver(event.target.value);
  };

  const updateDriver = async () => {
    if (selectedRowIds.length === 0) {
      setStatusMessage({
        message: "Please select at least one trip to update the driver.",
        type: "error",
      });
      return;
    }
  
    if (!newdriver || newdriver <= 0) {
      setStatusMessage({
        message: "Please select a valid driver.",
        type: "error",
      });
      return;
    }
  
    // Find the selected driver by SSN
    const selectedDriver = DriverStation.find((driver) => driver.ssn == newdriver);
    console.log(selectedDriver);
    if (!selectedDriver) {
      setStatusMessage({
        message: "Driver not found. Please select a valid driver.",
        type: "error",
      });
      return;
    }
  
    // Prepare updated trips payload
    const updatedTrips = selectedRowIds.map((id) => ({
      trip_id: id, // Directly using `id` since you already have it
      d_ssn: selectedDriver.ssn, // Use the SSN of the selected driver
    }));
  
    try {
      const response = await fetch(
        "http://localhost:6969/manager/set-trip-driver",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ trips: updatedTrips }),
        }
      );
  
      const data = await response.json();
  
      if (data.success) {
        setRows((prevRows) =>
          prevRows.map((row) =>
            selectedRowIds.includes(row.id)
              ? {
                  ...row,
                  Driver: `${selectedDriver.fname} ${selectedDriver.lname}`, // Update with full driver name
                }
              : row
          )
        );
        setStatusMessage({
          message: "Driver updated successfully.",
          type: "success",
        });
      } else {
        setStatusMessage({
          message: data.message || "Error updating driver.",
          type: "error",
        });
      }
    } catch (error) {
      console.error("Error updating driver:", error);
      setStatusMessage({
        message: "An error occurred while updating the driver.",
        type: "error",
      });
    }
  };
  

  useEffect(() => {
    if (!userssn) return;

    fetch("http://localhost:6969/manager/trips", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        m_ssn: userssn,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.data) {
          const transformedData = data.data.map((trip) => ({
            id: trip.trip_id,
            Driver: trip.driver_full_name,
            Source: trip.source_station,
            Destination: trip.destination_station,
            Price: trip.price,
            EstimatedTime: trip.estimated_time,
          }));
          setRows(transformedData);
        }
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, [userssn]);

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



  useEffect(() => {
    axios
      .post("http://localhost:6969/manager/available-drivers", { m_ssn: userssn })
      .then((response) => {
        if (Array.isArray(response.data.data)) {
          setDriverStations(response.data.data);
        } else {
          console.error("Unexpected response format:", response.data);
        }
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, [userssn]);

  return (
    <div className="List">
      <div style={{ height: 400, width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={5}
          checkboxSelection
          onRowSelectionModelChange={(newSelectionModel) =>
            handleSelectionChange(newSelectionModel)
          }
        />
        <div style={{ marginLeft: 40 }}>
          <h3>Selected Row IDs:</h3>
          <pre style={{ whiteSpace: "nowrap" }}>
            {JSON.stringify(selectedRowIds, null, 2).replace(/\n/g, " ")}
          </pre>
        </div>

        <div id="messages-container">
          {statusMessage.message && (
            <p
              className={
                statusMessage.type === "error"
                  ? "error-message"
                  : "success-message"
              }
            >
              {statusMessage.message}
            </p>
          )}
        </div>

        <div id="button-container" style={{ marginTop: "20px" }}>
          <ul
            style={{
              display: "flex",
              justifyContent: "space-between",
              listStyle: "none",
              padding: 0,
            }}
          >
            <li style={{ width: "23%" }}>
              <button
                id="add-trip-btn"
                className="button"
                onClick={() => (window.location.href = "/manager/trips/add")}
              >
                Add Trip
              </button>
            </li>

            <li style={{ width: "23%", display: "flex", flexDirection: "column" }}>
              <button
                id="set-price-btn"
                className="button"
                onClick={updatePrice}
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                }}
              >
                Update Price
              </button>
              <div className="input-container" id="update-input" style={{ width: "100%" }}>
                <input
                  type="number"
                  value={newPrice}
                  onChange={handlePriceChange}
                  placeholder="Enter new price"
                  min="0"
                  step="0.1"
                  style={{
                    width: "100%",
                    boxSizing: "border-box",
                    marginTop: "0",
                  }}
                />
              </div>
            </li>

            <li style={{ width: "23%" }}>
              <button
                id="update-destination-btn"
                className="button"
                onClick={updateDest}
              >
                Update Destination
              </button>
              <select
                id="styled-combobox"
                value={newDest}
                onChange={handleDestChange}
                style={{margin:'auto', width:'95%'}}

              >
                <option value="">-- Select Destination --</option>
                {destinationStations.map((station) => (
                  <option key={station.station_id} value={station.station_id}>
                    {station.station_name}
                  </option>
                ))}
              </select>
            </li>

            <li style={{ width: "23%" }}>
              <button
                id="set-driver-btn"
                className="button"
                onClick={updateDriver}
              >
                Set Driver
              </button>
              <select
                id="styled-combobox"
                value={newdriver}
                onChange={handleDriverChange}
                style={{margin:'auto', width:'95%'}}
              >
                <option value="">-- Select Driver --</option>
                {DriverStation.map((driver) => (
                  <option key={driver.ssn} value={driver.ssn}>
                    {`${driver.fname} ${driver.lname}`}
                  </option>
                ))}
              </select>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );

}
