import { useState } from "react";
import NavA from "./Components/navbar";
import "./styles.css";

export default function CreateAdmin() {
  const [formInput, setFormInput] = useState({
    fname: "",
    mname: "",
    lname: "",
    email: "",
    password: "",
    confirmPassword: "",
    job: "Admin",

    ssn: "",
  });
  const [message, setMessage] = useState("");

  const validateForm = () => {
    for (let key in formInput) {
      if (formInput[key].trim() === "") {
        console.log(`Validation failed at ${key}: ${formInput[key]}`);
        return "Please fill in all fields.";
      }
    }
    return null;
  };

  const sendData = async () => {
    const validationError = validateForm();
    if (validationError) {
      setMessage({ type: "error", text: validationError });
      return;
    }

    setMessage("");

    try {
      const response = await fetch("http://localhost:6969/accounts/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formInput),
      });

      const result = await response.json();
      if (result.success) {
        setMessage({ type: "success", text: "Admin created successfully!" });
        setFormInput({
          fname: "",
          mname: "",
          lname: "",
          email: "",
          password: "",
          confirmPassword: "",
          job: "Manager",
          ssn: "",
        });
        window.location.reload();
      } else {
        setMessage({
          type: "error",
          text: result.message || "An error occurred.",
        });
      }
    } catch (error) {
      console.error("Error sending data:", error);
      setMessage({
        type: "error",
        text: "An error occurred while sending the data.",
      });
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormInput({ ...formInput, [name]: value });
    setMessage("");
  };

  return (
    <div>
      <h2 id="site_Title">Create Admin</h2>
      <div id="CreateAdmin">
        <form
          id="CreateAdmin_box"
          onSubmit={(event) => {
            event.preventDefault();
            sendData();
          }}
        >
          <div id="input-container">
            <input
              value={formInput.fname}
              type="text"
              name="fname"
              placeholder="First Name"
              onChange={handleChange}
              pattern="[A-Za-z\s]+" // HTML validation pattern
              title="Please enter only letters."
            />
          </div>

          <div id="input-container">
            <input
              value={formInput.mname}
              type="text"
              name="mname"
              placeholder="Middle Name"
              onChange={handleChange}
              pattern="[A-Za-z\s]+" // HTML validation pattern
              title="Please enter only letters."
            />
          </div>

          <div id="input-container">
            <input
              value={formInput.lname}
              type="text"
              name="lname"
              placeholder="Last Name"
              onChange={handleChange}
              pattern="[A-Za-z\s]+" // HTML validation pattern
              title="Please enter only letters."
            />
          </div>

          <div id="input-container">
            <input
              value={formInput.email}
              type="email"
              name="email"
              placeholder="Email"
              onChange={handleChange}
            />
          </div>

          <div id="input-container">
            <input
              value={formInput.password}
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleChange}
            />
          </div>

          <div id="input-container">
            <input
              value={formInput.confirmPassword}
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              onChange={handleChange}
            />
          </div>

          <div id="input-container">
            <input
              value={formInput.ssn}
              type="text"
              name="ssn"
              placeholder="SSN"
              onChange={handleChange}
              onInput={(e) => {
                e.target.value = e.target.value.replace(/[^0-9]/g, "");
              }}
            />
          </div>

          {message && (
            <div className={`message ${message.type}`}>{message.text}</div>
          )}

          <button id="button">Submit</button>
        </form>
      </div>
    </div>
  );
}
