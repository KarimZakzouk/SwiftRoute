import React, { useState, useEffect } from "react";
import axios from "axios";
import "./styles.css";

export default function HireManager() {
  const [Stations, setStations] = useState([]);
  const [formInput, setFormInput] = useState({
    fname: "",
    mname: "",
    lname: "",
    email: "",
    password: "",
    confirmPassword: "",
    m_ssn: "",
    station_id: "",
  });
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccessMessage(""); 

    if (formInput.password !== formInput.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const response = await fetch("http://localhost:6969/admin/hireManager", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formInput),
      });

      if (response.ok) {
        const data = await response.json();
        setSuccessMessage("Manager hired successfully!");
        console.log("Success:", data);
      } else {
        const errorData = await response.json();
        setError(
          errorData.message || "An error occurred while hiring the manager."
        );
        console.log("Error:", errorData);
      }
    } catch (error) {
      console.error("Error during fetch:", error);
      setError("An error occurred. Please try again later.");
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormInput({ ...formInput, [name]: value });
  };

  useEffect(() => {
    axios
      .post("http://localhost:6969/admin/stations_with_no_managers", {})
      .then((response) => {
        if (Array.isArray(response.data.data)) {
          setStations(response.data.data);
        } else {
          console.error("Unexpected response format:", response.data);
        }
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  return (
    <div>
      <form className="input-container" onSubmit={handleSubmit}>
        <input
          style={{ width: "100%", margin: "0", marginBottom: "10px" }}
          type="text"
          name="fname"
          pattern="[A-Za-z\s]+" // HTML validation pattern
          title="Please enter only letters."
          value={formInput.fname}
          onChange={handleChange}
          placeholder="First Name"
          required
        />
        <input
          style={{ width: "100%", margin: "0", marginBottom: "10px" }}
          type="text"
          name="mname"
          pattern="[A-Za-z\s]+" // HTML validation pattern
          title="Please enter only letters."
          value={formInput.mname}
          onChange={handleChange}
          placeholder="Middle Name"
        />
        <input
          style={{ width: "100%", margin: "0", marginBottom: "10px" }}
          type="text"
          name="lname"
          pattern="[A-Za-z\s]+" // HTML validation pattern
          title="Please enter only letters."
          value={formInput.lname}
          onChange={handleChange}
          placeholder="Last Name"
          required
        />
        <input
          style={{ width: "100%", margin: "0", marginBottom: "10px" }}
          type="email"
          name="email"
          value={formInput.email}
          onChange={handleChange}
          placeholder="Email"
          required
        />
        <input
          style={{ width: "100%", margin: "0", marginBottom: "10px" }}
          type="text"
          name="m_ssn"
          value={formInput.m_ssn}
          onChange={(e) => {
            // Allow only numbers
            const value = e.target.value.replace(/\D/g, ""); // Remove any non-numeric characters
            setFormInput({
              ...formInput,
              m_ssn: value,
            });
          }}
          placeholder="SSN"
          required
        />
        <input
          style={{ width: "100%", margin: "0", marginBottom: "10px" }}
          type="password"
          name="password"
          value={formInput.password}
          onChange={handleChange}
          placeholder="Password"
          required
        />
        <input
          style={{ width: "100%", margin: "0", marginBottom: "10px" }}
          type="password"
          name="confirmPassword"
          value={formInput.confirmPassword}
          onChange={handleChange}
          placeholder="Confirm Password"
          required
        />

        <div id="button-container" style={{ marginTop: "20px" }}>
          <ul
            style={{
              display: "flex",
              justifyContent: "space-between",
              listStyle: "none",
              padding: 0,
              margin: "auto",
            }}
          >
            <div className="dsds">
            <li style={{} }>
              <button type="submit" className="button">
                Hire Manager
              </button>
              <select
                id="styled-combobox"
                name="station_id"
                value={formInput.station_id}
                onChange={handleChange}
                style={{ margin: "auto", width: "95%" }}
                required
              >
                <option value="">-- Select Station --</option>
                {Stations.map((station) => (
                  <option key={station.station_id} value={station.station_id}>
                    {station.station_name}
                  </option>
                ))}
              </select>
            </li>
            </div>
          </ul>
        </div>
      </form>

      {error && <div style={{ color: "red", marginTop: "10px" }}>{error}</div>}
      {successMessage && (
        <div style={{ color: "green", marginTop: "10px" }}>
          {successMessage}
        </div>
      )}
    </div>
  );
}
