import React, { useState, useEffect } from "react";
import Nav2 from "./Components/navbar";
import "./styles.css";

export default function Adddriver() {
  const [forminput, setforminput] = useState({
    d_ssn: "",
    salary: "",
    shift: "",
    m_ssn: "",
  });
  const userssn = sessionStorage.getItem("ssn");
  const [message, setMessage] = useState(""); // For both success and error messages

  useEffect(() => {
    if (userssn) {
      setforminput((prevState) => ({
        ...prevState,
        m_ssn: userssn,
      }));
    }
  }, [userssn]);

  const sendData = async () => {
    setMessage("");

    try {
      const response = await fetch("http://localhost:6969/manager/hire", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(forminput),
      });

      const result = await response.json();
      if (result.success) {
        setMessage({ type: "success", text: "Driver hired successfully!" });
      } else {
        setMessage({ type: "error", text: result.message || "An error occurred." });
      }
    } catch (error) {
      console.error("Error sending data:", error);
      setMessage({ type: "error", text: "An error occurred while sending the data." });
    }
  };

  return (
    <div>
      <h2 id="site_Title">Add Driver</h2>
      <div id="Addtrip">
        <form id="Addtrip_box">
          <div id="input-container">
            <label>Driver SSN</label>
            <input
              value={forminput.d_ssn}
              type="number"
              step="1"
              onChange={(event) => {
                setforminput({ ...forminput, d_ssn: event.target.value });
              }}
            />
          </div>

          <div id="input-container">
            <label>Salary</label>
            <input
              value={forminput.salary}
              type="number"
              step="1"
              onChange={(event) => {
                setforminput({ ...forminput, salary: event.target.value });
              }}
            />
          </div>

          <div id="input-container">
            <label>Shift</label>
            <input
              value={forminput.shift}
              type="number"
              step="1"
              onChange={(event) => {
                setforminput({ ...forminput, shift: event.target.value });
              }}
            />
          </div>

          {message && (
            <div className={`message ${message.type}`}>
              {message.text}
            </div>
          )}

          <button id="button" type="button" style={{ width: "100%" }} onClick={sendData}>
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}
