import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import StarRatings from "react-star-ratings";
import "./styles.css";

export default function Griddriv() {
  const [rows, setRows] = useState([]);
  const [selectedRowIds, setSelectedRowIds] = useState([]);
  const [newSalary, setNewSalary] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showWarning, setShowWarning] = useState(false);
  const navigate = useNavigate();

  const userssn = sessionStorage.getItem("ssn");

  const handleSelectionChange = (newSelectionModel) => {
    setSelectedRowIds(newSelectionModel);
    setShowWarning(false);
  };

  useEffect(() => {
    fetch("http://localhost:6969/manager/drivers", {
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
        console.log(data.data);
        if (data.success) {
          const transformedData = data.data.map((item, index) => ({
            id: index,
            ssn: item.ssn,
            username: `${item.fname} ${item.lname}`,
            salary: item.salary,
            rate: item.rate,
            attendance_days: item.attendance_days,
          }));
          setRows(transformedData);
        } else {
          console.error("Error in response:", data);
        }
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, [userssn]);

  const handleUpdateSalary = () => {
    if (selectedRowIds.length === 0) {
      setErrorMessage("Please select a driver first!");
      setSuccessMessage("");
      return;
    }

    const selectedDrivers = selectedRowIds.map((id) =>
      rows.find((row) => row.id === id)
    );

    const updatedSalary = parseFloat(newSalary);
    if (isNaN(updatedSalary) || updatedSalary <= 0) {
      setErrorMessage("Please enter a valid salary");
      setSuccessMessage("");
      return;
    }

    selectedDrivers.forEach((driver) => {
      fetch("http://localhost:6969/manager/update-salary", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          m_ssn: userssn,
          d_ssn: driver.ssn,
          new_salary: updatedSalary,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            setSuccessMessage("Salary updated successfully");
            setErrorMessage("");
            fetchDrivers();
          } else {
            console.error("Error updating salary:", data);
            setErrorMessage("Failed to update salary");
            setSuccessMessage("");
          }
        })
        .catch((error) => {
          console.error("Error updating salary:", error);
          setErrorMessage("Error updating salary");
          setSuccessMessage("");
        });
    });
  };

  const handleRemoveDriver = () => {
    if (selectedRowIds.length === 0) {
      setShowWarning(true); // Show the warning if no driver is selected
      setErrorMessage("Please select a driver first!");
      setSuccessMessage("");
      return;
    }

    const confirmRemoval = window.confirm(
      "Are you sure you want to remove the selected driver(s)?"
    );

    if (confirmRemoval) {
      const selectedDrivers = selectedRowIds.map((id) =>
        rows.find((row) => row.id === id)
      );

      selectedDrivers.forEach((driver) => {
        fetch("http://localhost:6969/manager/fire", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            m_ssn: userssn,
            d_ssn: driver.ssn,
          }),
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.success) {
              setSuccessMessage("Driver(s) removed successfully");
              setErrorMessage("");
              // After successful removal, fetch the updated list of drivers
              fetchDrivers();
            } else {
              console.error("Error Removing Driver:", data);
              setErrorMessage("Failed to Remove Driver");
              setSuccessMessage("");
            }
          })
          .catch((error) => {
            console.error("Error Removing Driver:", error);
            setErrorMessage("Error Removing Driver");
            setSuccessMessage("");
          });
      });
    }
  };

  const fetchDrivers = () => {
    fetch("http://localhost:6969/manager/drivers", {
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
        if (data.success) {
          const transformedData = data.data.map((item, index) => ({
            id: index,
            ssn: item.ssn,
            username: `${item.fname} ${item.lname}`,
            salary: item.salary,
          }));
          setRows(transformedData);
        } else {
          console.error("Error in response:", data);
        }
      })
      .catch((error) => console.error("Error fetching data:", error));
  };

const columns = [
  { field: "ssn", headerName: "SSN", width: 200 },
  { field: "username", headerName: "Username", width: 300 },
  { field: "salary", headerName: "Salary", width: 200 },
  {
    field: "rate",
    headerName: "Rate",
    width: 150,
    renderCell: (params) => (
      <StarRatings
        rating={
          params.row.rate === null
            ? 0
            : !isNaN(params.row.rate)
            ? parseFloat(params.row.rate)
            : 0
        }
        starRatedColor="gold"
        numberOfStars={5}
        name="rating"
        starDimension="20px"
        starSpacing="3px"
      />
    ),
  },
  { field: "attendance_days", headerName: "Attendance", width: 200 },
];

  return (
    <div id="griddriv-container">
      <div id="data-grid-container" className="grid-container">
        <DataGrid
          id="data-grid"
          rows={rows}
          columns={columns}
          pageSize={5}
          checkboxSelection
          onRowSelectionModelChange={(newSelectionModel) =>
            handleSelectionChange(newSelectionModel)
          }
        />
      </div>

      <div id="selected-row-preview">
        <h3>Selected Row ssn:</h3>
        <pre>{JSON.stringify(selectedRowIds, null, 2)}</pre>
      </div>

      <div id="messages-container">
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        {successMessage && <p className="success-message">{successMessage}</p>}
      </div>
      <div id="button-container">
        <ul>
          <li className="button-item">
            <button
              id="update-salary-btn"
              className="button"
              onClick={handleUpdateSalary}
            >
              Update Salary
            </button>
            <input
              type="number"
              id="new-salary-input"
              placeholder="Enter new salary"
              value={newSalary}
              style={{ margin: "auto", width: "100%" }}
              onChange={(e) => setNewSalary(e.target.value)}
            />
          </li>

          <li className="button-item">
            <button
              id="add-driver-btn"
              className="button"
              onClick={() => navigate("/manager/drivers/add")}
            >
              Add Driver
            </button>
          </li>

          <li className="button-item">
            <button
              id="remove-driver-btn"
              className="button"
              onClick={handleRemoveDriver}
            >
              Remove Driver
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
}
