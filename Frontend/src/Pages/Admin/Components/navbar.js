import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./styles.css";
import { useNavigate } from "react-router-dom";
import { IoMdPersonAdd } from "react-icons/io";

export default function NavbarA() {
  const navigate = useNavigate();
  let [openSettings, setOpenSettings] = useState(false);
  let [deleteAcc, setDeleteAcc] = useState(false);
  const userssn = sessionStorage.getItem("ssn");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const handleDeleteAcc = async () => {
    try {
      const result = await fetch(
        "http://localhost:6969/accounts/delete-account",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ssn: userssn }),
        }
      );
      const resultInjson = await result.json();
      console.log(resultInjson);
    } catch (error) {
      console.error("Error adding user:", error);
    }
    setDeleteAcc(false);
    localStorage.removeItem("authToken");
    sessionStorage.clear();
    navigate("/");
  };

  return (
    <>
      <nav className="navbar">
        <a href="/admin" className="site-title">
          Admin
        </a>
        <ul className="nav-links">
        <li>
            <Link className="nav-btn" to="/admin/hireManagers">
              Hire Managers
            </Link>
          </li>
          <li>
            <Link className="nav-btn" to="/admin/stations">
              Stations
            </Link>
          </li>
          <li>
            <Link className="nav-btn" to="/admin/requests">
              Requests
            </Link>
          </li>
          <li
            style={{
              listStyleType: "none",
              position: "relative", // Allows absolute positioning of the dropdown
              display: "inline-block", // Makes the button act like a dropdown
            }}
            onClick={() => setIsDropdownOpen(!isDropdownOpen)} // Toggle dropdown
          >
            <button
              style={{
                backgroundColor: "#3498db", // Blue background for the button
                border: "none",
                cursor: "pointer",
                padding: "10px",
                fontSize: "16px",
                fontWeight: "bold",
                color: "#fff", // White text color
              }}
              className="nav-btn"
            >
              Reports
            </button>
            {isDropdownOpen && (
              <ul
                style={{
                  listStyleType: "none",
                  position: "absolute",
                  top: "100%", // Positions the dropdown below the button
                  left: "50%", // Centers the dropdown horizontally
                  transform: "translateX(-50%)", // Corrects the offset caused by 'left: 50%' to truly center
                  backgroundColor: "#fff",
                  boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.2)",
                  padding: "10px",
                  margin: "0",
                  width: "140px",
                  flexDirection: "column"// You can adjust the width as needed
                }}
              >
                <li style={{ width: "100px" }}>
                  <button
                    style={{
                      border: "none",
                      cursor: "pointer",
                      width: "100px",
                      padding: "10px",
                    }}
                    className="nav-btn"
                    onClick={() => {
                      navigate("/admin/Reports");
    
                    }}
                  >
                    Reports Stations
                  </button>
                </li>
                <li style={{ width: "100px" }}>
                  <button
                    style={{
                      border: "none",
                      cursor: "pointer",
                      width: "100px",
                      padding: "10px",
                    }}
                    className="nav-btn"
                    onClick={() => {
                      navigate("/admin/Reports/Managers");
                    }}
                  >
                    Reports Managers
                  </button>
                </li>
                <li style={{ width: "100px" }}>
                  <button
                    style={{
                      border: "none",
                      cursor: "pointer",
                      width: "100px",
                      padding: "10px",
                    }}
                    className="nav-btn"
                    onClick={() => {
                      navigate("/admin/Reports/Drivers");
                    }}
                  >
                    Reports Drivers
                  </button>
                </li>
                <li style={{ width: "100px" }}>
                  <button
                    style={{
                      border: "none",
                      cursor: "pointer",
                      width: "100px",
                      padding: "10px",
                    }}
                    className="nav-btn"
                    onClick={() => {
                      navigate("/admin/Reports/Passengers");
                    }}
                  >
                    Reports Passengers
                  </button>
                </li>
                <li style={{ width: "100px" }}>
                  <button
                    style={{
                      border: "none",
                      cursor: "pointer",
                      width: "100px",
                      padding: "10px",
                    }}
                    className="nav-btn"
                    onClick={() => {
                      navigate("/admin/Reports/Managerial");
                    }}
                  >
                    Managrial Reports
                  </button>
                </li>
                <li style={{ width: "100px" }}>
                  <button
                    style={{
                      border: "none",
                      cursor: "pointer",
                      width: "100px",
                      padding: "10px",
                    }}
                    className="nav-btn"
                    onClick={() => {
                      navigate("/admin/Reports/Passengers");
                    }}
                  >
                    Reports Passengers
                  </button>
                </li>
                <li style={{ width: "100px" }}>
                  <button
                    style={{
                      border: "none",
                      cursor: "pointer",
                      width: "100px",
                      padding: "10px",
                    }}
                    className="nav-btn"
                    onClick={() => {
                      navigate("/admin/Reports/Detailed");
                    }}
                  >
                    Detailed Reports
                  </button>
                </li>
              </ul>
            )}
          </li>

          <li className="sidepop">
            <input id="toggleChecker" type="checkbox" />
            <label id="togglerLable" for="toggleChecker">
              <div
                style={{}}
                class="checkboxtoggler"
                onClick={() => {
                  setOpenSettings(!openSettings);
                  setDeleteAcc(false);
                }}
              >
                <div class="line-1"></div>
                <div class="line-2"></div>
                <div class="line-3"></div>
              </div>
            </label>
          </li>
          {openSettings ? (
            <div class="card-nav">
              <ul
                class="list"
                style={{
                  "--color": "#5353ff",
                  "--hover-storke": "#fff",
                  " --hover-color": "#fff",
                }}
              >
                <li
                  onClick={() => {
                    navigate("/admin/ProfileSettings");
                  }}
                  class="element"
                  style={{ "--color": "#5353ff" }}
                >
                  <label for="settings">
                    <input type="radio" id="settings" name="filed" />
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#7e8590"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      class="lucide lucide-settings"
                    >
                      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                    Settings
                  </label>
                </li>
                <div class="separator"></div>

                <li
                  onClick={() => navigate("/admin/ChangePassword")}
                  class="element "
                  style={{ "--color": "#5353ff" }}
                >
                  <label for="password">
                    <input type="radio" id="password" name="filed" />
                    <svg
                      fill="none"
                      viewBox="0 0 24 24"
                      height="24"
                      width="24"
                      xmlns="http://www.w3.org/2000/svg"
                      class="icon"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-width="1.5"
                        stroke="#141B34"
                        d="M18 11.0041C17.4166 9.91704 16.273 9.15775 14.9519 9.0993C13.477 9.03404 11.9788 9 10.329 9C8.67911 9 7.18091 9.03404 5.70604 9.0993C3.95328 9.17685 2.51295 10.4881 2.27882 12.1618C2.12602 13.2541 2 14.3734 2 15.5134C2 16.6534 2.12602 17.7727 2.27882 18.865C2.51295 20.5387 3.95328 21.8499 5.70604 21.9275C6.42013 21.9591 7.26041 21.9834 8 22"
                      ></path>
                      <path
                        stroke-linejoin="round"
                        stroke-linecap="round"
                        stroke-width="1.5"
                        stroke="#141B34"
                        d="M6 9V6.5C6 4.01472 8.01472 2 10.5 2C12.9853 2 15 4.01472 15 6.5V9"
                      ></path>
                      <path
                        fill="#141B34"
                        d="M21.2046 15.1045L20.6242 15.6956V15.6956L21.2046 15.1045ZM21.4196 16.4767C21.7461 16.7972 22.2706 16.7924 22.5911 16.466C22.9116 16.1395 22.9068 15.615 22.5804 15.2945L21.4196 16.4767ZM18.0228 15.1045L17.4424 14.5134V14.5134L18.0228 15.1045ZM18.2379 18.0387C18.5643 18.3593 19.0888 18.3545 19.4094 18.028C19.7299 17.7016 19.7251 17.1771 19.3987 16.8565L18.2379 18.0387ZM14.2603 20.7619C13.7039 21.3082 12.7957 21.3082 12.2394 20.7619L11.0786 21.9441C12.2794 23.1232 14.2202 23.1232 15.4211 21.9441L14.2603 20.7619ZM12.2394 20.7619C11.6914 20.2239 11.6914 19.358 12.2394 18.82L11.0786 17.6378C9.86927 18.8252 9.86927 20.7567 11.0786 21.9441L12.2394 20.7619ZM12.2394 18.82C12.7957 18.2737 13.7039 18.2737 14.2603 18.82L15.4211 17.6378C14.2202 16.4587 12.2794 16.4587 11.0786 17.6378L12.2394 18.82ZM14.2603 18.82C14.8082 19.358 14.8082 20.2239 14.2603 20.7619L15.4211 21.9441C16.6304 20.7567 16.6304 18.8252 15.4211 17.6378L14.2603 18.82ZM20.6242 15.6956L21.4196 16.4767L22.5804 15.2945L21.785 14.5134L20.6242 15.6956ZM15.4211 18.82L17.8078 16.4767L16.647 15.2944L14.2603 17.6377L15.4211 18.82ZM17.8078 16.4767L18.6032 15.6956L17.4424 14.5134L16.647 15.2945L17.8078 16.4767ZM16.647 16.4767L18.2379 18.0387L19.3987 16.8565L17.8078 15.2945L16.647 16.4767ZM21.785 14.5134C21.4266 14.1616 21.0998 13.8383 20.7993 13.6131C20.4791 13.3732 20.096 13.1716 19.6137 13.1716V14.8284C19.6145 14.8284 19.619 14.8273 19.6395 14.8357C19.6663 14.8466 19.7183 14.8735 19.806 14.9391C19.9969 15.0822 20.2326 15.3112 20.6242 15.6956L21.785 14.5134ZM18.6032 15.6956C18.9948 15.3112 19.2305 15.0822 19.4215 14.9391C19.5091 14.8735 19.5611 14.8466 19.5879 14.8357C19.6084 14.8273 19.6129 14.8284 19.6137 14.8284V13.1716C19.1314 13.1716 18.7483 13.3732 18.4281 13.6131C18.1276 13.8383 17.8008 14.1616 17.4424 14.5134L18.6032 15.6956Z"
                      ></path>
                    </svg>
                    change Password
                  </label>
                </li>
                <div class="separator"></div>

                <li
                  onClick={() => navigate("/admin/create-admin")}
                  class="element "
                  style={{ "--color": "#5353ff" }}
                >
                  <label for="create-admin">
                    <input type="radio" id="create-admin" name="filed" />
                    <IoMdPersonAdd />
                    Create Admin
                  </label>
                </li>
                <div class="separator"></div>
                <li
                  onClick={() => setDeleteAcc(true)}
                  class="element delete"
                  style={{ "--color": "#8e2a2a" }}
                >
                  <label for="delete">
                    <input type="radio" id="delete" name="filed" />
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#7e8590"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      className="lucide lucide-trash-2"
                    >
                      <path d="M3 6h18"></path>
                      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                      <line x1="10" x2="10" y1="11" y2="17"></line>
                      <line x1="14" x2="14" y1="11" y2="17"></line>
                    </svg>
                    Delete
                  </label>
                </li>
                <div class="separator"></div>
                <li
                  className="element"
                  style={{
                    "--color": "rgb(56, 45, 71, 0.836)",
                    "--hover-storke": "#bd89ff",
                    "--hover-color": "#bd89ff",
                  }}
                >
                  <label
                    for="teamaccess"
                    onClick={() => {
                      localStorage.removeItem("authToken");
                      sessionStorage.clear();
                      navigate("/");
                    }}
                  >
                    <input type="radio" id="teamaccess" name="filed" />
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#7e8590"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      className="lucide lucide-users-round"
                    >
                      <path
                        className="group-focus:fill-white"
                        fill="#5353ff"
                        d="M17.2929 14.2929C16.9024 14.6834 16.9024 15.3166 17.2929 15.7071C17.6834 16.0976 18.3166 16.0976 18.7071 15.7071L21.6201 12.7941C21.6351 12.7791 21.6497 12.7637 21.6637 12.748C21.87 12.5648 22 12.2976 22 12C22 11.7024 21.87 11.4352 21.6637 11.252C21.6497 11.2363 21.6351 11.2209 21.6201 11.2059L18.7071 8.29289C18.3166 7.90237 17.6834 7.90237 17.2929 8.29289C16.9024 8.68342 16.9024 9.31658 17.2929 9.70711L18.5858 11H13C12.4477 11 12 11.4477 12 12C12 12.5523 12.4477 13 13 13H18.5858L17.2929 14.2929Z"
                      ></path>
                      <path
                        className="group-focus:fill-white"
                        d="M5 2C3.34315 2 2 3.34315 2 5V19C2 20.6569 3.34315 22 5 22H14.5C15.8807 22 17 20.8807 17 19.5V16.7326C16.8519 16.647 16.7125 16.5409 16.5858 16.4142C15.9314 15.7598 15.8253 14.7649 16.2674 14H13C11.8954 14 11 13.1046 11 12C11 10.8954 11.8954 10 13 10H16.2674C15.8253 9.23514 15.9314 8.24015 16.5858 7.58579C16.7125 7.4591 16.8519 7.35296 17 7.26738V4.5C17 3.11929 15.8807 2 14.5 2H5Z"
                      ></path>
                    </svg>
                    Log Out
                  </label>
                </li>
              </ul>
            </div>
          ) : null}
        </ul>
      </nav>
      {deleteAcc ? (
        <>
          {/* <form className="popUp" onSubmit={(event) => submitReq(event)}> */}
          <div class="container-del">
            <div class="content-del">
              <div class="icon-wrapper-del">
                <svg
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  class="icon-del"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    clip-rule="evenodd"
                    d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                    fill-rule="evenodd"
                  ></path>
                </svg>
                <h2 class="title-del">Are you sure?</h2>
                <p class="description-del">
                  Do you really want to continue? This process cannot be undone.
                </p>
              </div>
              <div class="button-wrapper-del">
                <button
                  onClick={() => setDeleteAcc(false)}
                  class="button-del cancel-del"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAcc}
                  class="button-del confirm-del"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>

          {/* </form> */}

          <div
            className="form-del"
            onClick={() => {
              setDeleteAcc(false);
              // setOpenSettings(false);
            }}
          ></div>
        </>
      ) : null}
    </>
  );
}
