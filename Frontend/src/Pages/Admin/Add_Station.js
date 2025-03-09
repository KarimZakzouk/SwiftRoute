import { useState } from 'react';
import NavA from './Components/navbar';
import "./styles.css";

export default function AddTrip() {
  const [forminput, setforminput] = useState({
    station_name: "",
    street: "",
    zipcode: "",
    governorate: "",
  });
  const [message, setMessage] = useState("");

  const validateForm = () => {
    for (let key in forminput) {
      if (forminput[key].trim() === "") {
        console.log(`Validation failed at ${key}: ${forminput[key]}`);
        return "Please fill in all fields.";
      }
    }
    return null;
  };

  const sendData = async () => {
    const validationError = validateForm();
    if (validationError) {
      setMessage({ type: 'error', text: validationError });
      return; 
    }

    setMessage("");

    try {
      const response = await fetch('http://localhost:6969/admin/addStation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(forminput),
      });

      const result = await response.json();
      if (result.success) {
        setMessage({ type: 'success', text: 'Station added successfully!' });
      } else {
        setMessage({ type: 'error', text: result.message || "An error occurred." });
      }
    } catch (error) {
      console.error('Error sending data:', error);
      setMessage({ type: 'error', text: "An error occurred while sending the data." });
    }
  };

  return (
    <div>
      <h2 id="site_Title">Add Station</h2>
      <div id="Addtrip">
        <form id="Addtrip_box">
          <div id="input-container">
            <label>Station Name</label>
            <input
              value={forminput.station_name}
              type="text"
              onChange={(event) => setforminput({ ...forminput, station_name: event.target.value })}
            />
          </div>

          <div id="input-container">
            <label>Street</label>
            <input
              value={forminput.street}
              type="text"
              onChange={(event) => setforminput({ ...forminput, street: event.target.value })}
            />
          </div>

          <div id="input-container">
            <label>ZIP</label>
            <input
              value={forminput.zipcode}
              type="text"
              onChange={(event) => setforminput({ ...forminput, zipcode: event.target.value })}
            />
          </div>

          <div id="input-container">
            <label>Governorate</label>
            <input
              value={forminput.governorate}
              type="text"
              onChange={(event) => setforminput({ ...forminput, governorate: event.target.value })}
            />
          </div>

          {message && (
            <div className={`message ${message.type}`}>
              {message.text}
            </div>
          )}

          <button id="button" type="button" onClick={sendData}>
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}
