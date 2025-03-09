import "./AllTrips.css";
import { useState, useEffect } from "react";
import axios from "axios";

// import { MdChevronLeft, MdChevronRight } from 'react-icons/md';
import DataTable, { createTheme } from "react-data-table-component";

import { Link, NavLink, useLocation } from "react-router-dom";
function AllTrips() {
  // let [reqState, setReqState] = useState(false);
  const userID = sessionStorage.getItem("ssn");
  let [tripData, setTripData] = useState({
    t_id: 0,
    p_id: userID,
    rate: 0,
  });

  // mean accept and start if false mean reject if true means accept and start
  let [warningPopUp, setWarningPopUp] = useState(false);
  let [bookState, setBookState] = useState(false);
  let [checkState, setCheckState] = useState(false);
  let [showTrips, setShowTrips] = useState(false);

  const columns = [
    {
      name: "Source",
      cell: (row) => (
        <NavLink
          to="/Passenger/Station"
          className="links"
          state={{ value: row.source_id }}
        >
          {row.source}
        </NavLink>
      ),
    },
    {
      name: "Destination",
      cell: (row) => (
        <NavLink
          to="/Passenger/Station"
          className="links"
          state={{ value: row.destination_id }}
        >
          {row.destination}
        </NavLink>
      ),
    },
    {
      name: "Driver",
      cell: (row) => (
        <NavLink
          to="/Passenger/Drivers"
          className="links"
          state={{ value: row.driver_ssn }}
        >
          {row.driver_fname}
        </NavLink>
      ),
    },

    {
      name: "Price",
      selector: (row) => row.price,
      // maxWidth: "100px",
      sortable: true,
    },
    // {
    //   name: "Date",
    //   selector: (row) => row.Date,
    // },

    {
      name: "EstimatedTime (hr)",
      selector: (row) => row.estimated_time,
    },
    {
      name: "Book",
      minWidth: "300px",
      minHieght: "200px",
      cell: (row) => (
        <button
          onClick={() => {
            setTripData({ ...tripData, t_id: row.trip_id });
            handleCheckTrip({ ...tripData, t_id: row.trip_id });
          }}
          class="animated-button"
        >
          <svg
            viewBox="0 0 24 24"
            class="arr-2"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z"></path>
          </svg>
          <span class="text">Book Trip</span>
          <span class="circle"></span>
          <svg
            viewBox="0 0 24 24"
            class="arr-1"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z"></path>
          </svg>
        </button>
      ),
      ignoreRowClick: true, // Prevents row click events when button is clicked
      allowOverflow: true, // Allows the button to overflow if needed
      button: true, // Identifies the column as a button
    },
  ];

  let [recievedData, setRecievedData] = useState([]);

  function HandleTime(event, Row) {
    const filteredData = recievedData.map((row) => {
      if (row.trip_id === Row.trip_id) row.estimated_time = event.target.value;
      return row;
    });

    console.log(filteredData);
    setRecievedData(filteredData);
  }

  function HandleBook() {
    // console.log(event);
    const filteredData = recievedData.filter(
      (row) => row.trip_id !== tripData.t_id
    ); // Filter out the row by id

    setRecievedData(filteredData); // Update state to remove the deleted row
    setFilterDataState(filteredData); // Update state to remove the deleted row
    /// to make popup
  }

  const handleTrip = async (sendData) => {
    try {
      const result = await fetch(
        "http://localhost:6969/passenger/requestTrip",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(sendData),
        }
      );
      const resultInjson = await result.json();
      console.log(resultInjson);
      if(resultInjson.success)
        HandleBook();
    } catch (error) {
      console.error("Error adding user:", error);
    }
  };
  useEffect(() => {
    (async () => {
      try {
        const result = await fetch("http://localhost:6969/passenger/getTrips", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ p_id: userID }),
        });
        const resultInjson = await result.json();
        console.log(resultInjson);
        setRecievedData(resultInjson.data);
        setFilterDataState(resultInjson.data);
      } catch (error) {
        console.error(error);
      }
    })();
  }, []);

  const handleCheckTrip = async (sendData) => {
    try {
      const result = await fetch("http://localhost:6969/passenger/getTrips", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ p_id: userID }),
      });
      const resultInjson = await result.json();
      console.log(resultInjson);
      setRecievedData(resultInjson.data);
      setFilterDataState(resultInjson.data);
      const newData = resultInjson.data.filter((ele) => {
        return ele.trip_id === sendData.t_id;
      });
      if (newData.length !== 0) {
        console.log("1");
        setBookState(true);
      } else {
        // window.alert("Please select");
        setWarningPopUp(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // const HandleLost = async () => {
  //   setReqState(true);
  // };

  // createTheme creates a new theme named solarized that overrides the build in dark theme
  createTheme(
    "solarized",
    {
      text: {
        primary: "#268bd2",
        secondary: "#2aa198",
      },
      background: {
        default: "#002b36",
      },
      context: {
        background: "#cb4b16",
        text: "#FFFFFF",
      },
      divider: {
        default: "#073642",
      },
      action: {
        button: "rgba(0,0,0,.54)",
        hover: "rgba(0,0,0,.08)",
        disabled: "rgba(0,0,0,.12)",
      },
    },
    "dark"
  );

  createTheme("dark", {
    background: {
      default: "transparent",
    },
  });

  const customStyles = {
    rows: {
      style: {
        minHeight: "72px", // override the row height
      },
    },
    headCells: {
      style: {
        paddingLeft: "8px", // override the cell padding for head cells
        paddingRight: "8px",
      },
    },
    cells: {
      style: {
        paddingLeft: "8px", // override the cell padding for data cells
        paddingRight: "8px",
      },
    },
  };

  function review() {
    if (tripData.rate === 0) {
      setCheckState(true);
      // send data

      ///
      ///
      ///
      ///
      ///
      // HandleBook();
    } else {
      // setTripData({ ...tripData, rate: reviewState });
      handleTrip(tripData);
      // HandleBook();
      setBookState(false);
      setTripData({ ...tripData, rate: 0 });
    }
  }
  let [filterDataState, setFilterDataState] = useState(recievedData);

  function handleFilterSource(event) {
    const newData = recievedData.filter((row) => {
      return (
        row.source.toLowerCase().includes(event.target.value.toLowerCase()) ||
        (row.source_street + " " + row.source_governorate)
          .toLowerCase()
          .includes(event.target.value.toLowerCase()) // can be by station address or governate of station
      );
    });
    setFilterDataState(newData);
    setShowTrips(true);
  }

  function handleFilterDestination(event) {
    console.log(event.target.value.toLowerCase());
    const newData = recievedData.filter((row) => {
      return (
        row.destination
          .toLowerCase()
          .includes(event.target.value.toLowerCase()) ||
        (row.destinationstreet + " " + row.destination_governorate)
          .toLowerCase()
          .includes(event.target.value.toLowerCase()) // can be by station address or governate of station
      );
    });
    setFilterDataState(newData);
    setShowTrips(true);
  }

  // function reviewcheck(){

  //     else
  //   setBookState(false)

  //   }

  return (
    <div style={{ height: "fit-content" }}>
      <div className="containerTrips">
        {/* <input type="text"></input> */}
        {/* <div>
          <input type="text" onChange={(event)=>handleFilter(event)}></input>
        </div> */}
        <div class="cont">
          <div id="poda">
            <div class="glow"></div>
            <div class="darkBorderBg"></div>
            <div class="darkBorderBg"></div>
            <div class="darkBorderBg"></div>

            <div class="white"></div>

            <div class="border"></div>

            <div id="main">
              <input
                placeholder="Your Location..."
                type="text"
                name="text"
                class="input"
                onChange={(event) => handleFilterSource(event)}
              />
              <div id="input-mask"></div>
              <div id="pink-mask"></div>
              <div class="filterBorder"></div>
              <div id="filter-icon">
                <svg
                  preserveAspectRatio="none"
                  height="27"
                  width="27"
                  viewBox="4.8 4.56 14.832 15.408"
                  fill="none"
                >
                  <path
                    d="M8.16 6.65002H15.83C16.47 6.65002 16.99 7.17002 16.99 7.81002V9.09002C16.99 9.56002 16.7 10.14 16.41 10.43L13.91 12.64C13.56 12.93 13.33 13.51 13.33 13.98V16.48C13.33 16.83 13.1 17.29 12.81 17.47L12 17.98C11.24 18.45 10.2 17.92 10.2 16.99V13.91C10.2 13.5 9.97 12.98 9.73 12.69L7.52 10.36C7.23 10.08 7 9.55002 7 9.20002V7.87002C7 7.17002 7.52 6.65002 8.16 6.65002Z"
                    stroke="#d6d6e6"
                    stroke-width="1"
                    stroke-miterlimit="10"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  ></path>
                </svg>
              </div>
              <div id="search-icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  viewBox="0 0 24 24"
                  stroke-width="2"
                  stroke-linejoin="round"
                  stroke-linecap="round"
                  height="24"
                  fill="none"
                  class="feather feather-search"
                >
                  <circle stroke="url(#search)" r="8" cy="11" cx="11"></circle>
                  <line
                    stroke="url(#searchl)"
                    y2="16.65"
                    y1="22"
                    x2="16.65"
                    x1="22"
                  ></line>
                  <defs>
                    <linearGradient gradientTransform="rotate(50)" id="search">
                      <stop stop-color="#f8e7f8" offset="0%"></stop>
                      <stop stop-color="#b6a9b7" offset="50%"></stop>
                    </linearGradient>
                    <linearGradient id="searchl">
                      <stop stop-color="#b6a9b7" offset="0%"></stop>
                      <stop stop-color="#837484" offset="50%"></stop>
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>
          </div>
          <div id="poda">
            <div class="glow"></div>
            <div class="darkBorderBg"></div>
            <div class="darkBorderBg"></div>
            <div class="darkBorderBg"></div>

            <div class="white"></div>

            <div class="border"></div>

            <div id="main">
              <input
                placeholder="Your Destination..."
                type="text"
                name="text"
                class="input"
                onChange={(event) => handleFilterDestination(event)}
              />
              <div id="input-mask"></div>
              <div id="pink-mask"></div>
              <div class="filterBorder"></div>
              <div id="filter-icon">
                <svg
                  preserveAspectRatio="none"
                  height="27"
                  width="27"
                  viewBox="4.8 4.56 14.832 15.408"
                  fill="none"
                >
                  <path
                    d="M8.16 6.65002H15.83C16.47 6.65002 16.99 7.17002 16.99 7.81002V9.09002C16.99 9.56002 16.7 10.14 16.41 10.43L13.91 12.64C13.56 12.93 13.33 13.51 13.33 13.98V16.48C13.33 16.83 13.1 17.29 12.81 17.47L12 17.98C11.24 18.45 10.2 17.92 10.2 16.99V13.91C10.2 13.5 9.97 12.98 9.73 12.69L7.52 10.36C7.23 10.08 7 9.55002 7 9.20002V7.87002C7 7.17002 7.52 6.65002 8.16 6.65002Z"
                    stroke="#d6d6e6"
                    stroke-width="1"
                    stroke-miterlimit="10"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  ></path>
                </svg>
              </div>
              <div id="search-icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  viewBox="0 0 24 24"
                  stroke-width="2"
                  stroke-linejoin="round"
                  stroke-linecap="round"
                  height="24"
                  fill="none"
                  class="feather feather-search"
                >
                  <circle stroke="url(#search)" r="8" cy="11" cx="11"></circle>
                  <line
                    stroke="url(#searchl)"
                    y2="16.65"
                    y1="22"
                    x2="16.65"
                    x1="22"
                  ></line>
                  <defs>
                    <linearGradient gradientTransform="rotate(50)" id="search">
                      <stop stop-color="#f8e7f8" offset="0%"></stop>
                      <stop stop-color="#b6a9b7" offset="50%"></stop>
                    </linearGradient>
                    <linearGradient id="searchl">
                      <stop stop-color="#b6a9b7" offset="0%"></stop>
                      <stop stop-color="#837484" offset="50%"></stop>
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>
          </div>
        </div>

        <DataTable
          title="Trips"
          columns={columns}
          data={filterDataState}
          theme="solarized"
          // selectableRows
          fixedHeader
          pagination
          customStyles={customStyles}
          paginationPerPage={6}
          //   expandableRows
          //   expandableRowsComponent={ExpandedComponent}
        />
      </div>
      {bookState ? (
        <>
          <div class="card">
            <svg
              class="wave"
              viewBox="0 0 1440 320"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M0,256L11.4,240C22.9,224,46,192,69,192C91.4,192,114,224,137,234.7C160,245,183,235,206,213.3C228.6,192,251,160,274,149.3C297.1,139,320,149,343,181.3C365.7,213,389,267,411,282.7C434.3,299,457,277,480,250.7C502.9,224,526,192,549,181.3C571.4,171,594,181,617,208C640,235,663,277,686,256C708.6,235,731,149,754,122.7C777.1,96,800,128,823,165.3C845.7,203,869,245,891,224C914.3,203,937,117,960,112C982.9,107,1006,181,1029,197.3C1051.4,213,1074,171,1097,144C1120,117,1143,107,1166,133.3C1188.6,160,1211,224,1234,218.7C1257.1,213,1280,139,1303,133.3C1325.7,128,1349,192,1371,192C1394.3,192,1417,128,1429,96L1440,64L1440,320L1428.6,320C1417.1,320,1394,320,1371,320C1348.6,320,1326,320,1303,320C1280,320,1257,320,1234,320C1211.4,320,1189,320,1166,320C1142.9,320,1120,320,1097,320C1074.3,320,1051,320,1029,320C1005.7,320,983,320,960,320C937.1,320,914,320,891,320C868.6,320,846,320,823,320C800,320,777,320,754,320C731.4,320,709,320,686,320C662.9,320,640,320,617,320C594.3,320,571,320,549,320C525.7,320,503,320,480,320C457.1,320,434,320,411,320C388.6,320,366,320,343,320C320,320,297,320,274,320C251.4,320,229,320,206,320C182.9,320,160,320,137,320C114.3,320,91,320,69,320C45.7,320,23,320,11,320L0,320Z"
                fill-opacity="1"
              ></path>
            </svg>
            <div class="icon-container">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
                stroke-width="0"
                fill="currentColor"
                stroke="currentColor"
                class="icon"
              >
                <path d="M256 48a208 208 0 1 1 0 416 208 208 0 1 1 0-416zm0 464A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0l-111 111-47-47c-9.4-9.4-24.6-9.4-33.9 0s-9.4 24.6 0 33.9l64 64c9.4 9.4 24.6 9.4 33.9 0L369 209z"></path>
              </svg>
            </div>
            <div class="message-text-container">
              <p class="message-text">Success Book</p>
              <p class="sub-text">Everything seems great</p>
              <div class="rating">
                <input
                  type="radio"
                  id="star-1"
                  name="star-radio"
                  value="star-1"
                />
                <label
                  for="star-1"
                  onClick={() => {
                    setTripData({ ...tripData, rate: 5 });
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path
                      pathLength="360"
                      d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z"
                    ></path>
                  </svg>
                </label>
                <input
                  type="radio"
                  id="star-2"
                  name="star-radio"
                  value="star-1"
                />
                <label
                  for="star-2"
                  onClick={() => {
                    setTripData({ ...tripData, rate: 4 });
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path
                      pathLength="360"
                      d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z"
                    ></path>
                  </svg>
                </label>
                <input
                  type="radio"
                  id="star-3"
                  name="star-radio"
                  value="star-1"
                />
                <label
                  for="star-3"
                  onClick={() => {
                    setTripData({ ...tripData, rate: 3 });
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path
                      pathLength="360"
                      d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z"
                    ></path>
                  </svg>
                </label>
                <input
                  type="radio"
                  id="star-4"
                  name="star-radio"
                  value="star-1"
                />
                <label
                  for="star-4"
                  onClick={() => {
                    setTripData({ ...tripData, rate: 2 });
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path
                      pathLength="360"
                      d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z"
                    ></path>
                  </svg>
                </label>
                <input
                  type="radio"
                  id="star-5"
                  name="star-radio"
                  value="star-1"
                />
                <label
                  for="star-5"
                  onClick={() => {
                    setTripData({ ...tripData, rate: 1 });
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path
                      pathLength="360"
                      d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z"
                    ></path>
                  </svg>
                </label>
              </div>
            </div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 15 15"
              stroke-width="0"
              fill="none"
              stroke="currentColor"
              class="cross-icon"
              onClick={() => {
                setBookState(false);
                setTripData({ ...tripData, rate: 0 });
              }}
            >
              <path
                fill="currentColor"
                d="M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.193 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.193 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z"
                clip-rule="evenodd"
                fill-rule="evenodd"
              ></path>
            </svg>
          </div>

          <div className={"fakepop"} onClick={() => review()}></div>
        </>
      ) : null}

      {checkState ? (
        <>
          <div class="card2">
            <svg
              class="wave2"
              viewBox="0 0 1440 320"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M0,256L11.4,240C22.9,224,46,192,69,192C91.4,192,114,224,137,234.7C160,245,183,235,206,213.3C228.6,192,251,160,274,149.3C297.1,139,320,149,343,181.3C365.7,213,389,267,411,282.7C434.3,299,457,277,480,250.7C502.9,224,526,192,549,181.3C571.4,171,594,181,617,208C640,235,663,277,686,256C708.6,235,731,149,754,122.7C777.1,96,800,128,823,165.3C845.7,203,869,245,891,224C914.3,203,937,117,960,112C982.9,107,1006,181,1029,197.3C1051.4,213,1074,171,1097,144C1120,117,1143,107,1166,133.3C1188.6,160,1211,224,1234,218.7C1257.1,213,1280,139,1303,133.3C1325.7,128,1349,192,1371,192C1394.3,192,1417,128,1429,96L1440,64L1440,320L1428.6,320C1417.1,320,1394,320,1371,320C1348.6,320,1326,320,1303,320C1280,320,1257,320,1234,320C1211.4,320,1189,320,1166,320C1142.9,320,1120,320,1097,320C1074.3,320,1051,320,1029,320C1005.7,320,983,320,960,320C937.1,320,914,320,891,320C868.6,320,846,320,823,320C800,320,777,320,754,320C731.4,320,709,320,686,320C662.9,320,640,320,617,320C594.3,320,571,320,549,320C525.7,320,503,320,480,320C457.1,320,434,320,411,320C388.6,320,366,320,343,320C320,320,297,320,274,320C251.4,320,229,320,206,320C182.9,320,160,320,137,320C114.3,320,91,320,69,320C45.7,320,23,320,11,320L0,320Z"
                fill-opacity="1"
              ></path>
            </svg>
            <div class="icon-container2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 15 15"
                stroke-width="0"
                fill="none"
                stroke="currentColor"
                class="cross-icon"
              >
                <path
                  fill="currentColor"
                  d="M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.193 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.193 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z"
                  clip-rule="evenodd"
                  fill-rule="evenodd"
                ></path>
              </svg>
            </div>
            <div class="message-text-container2">
              <p class="message-text2">Please Review</p>
            </div>
          </div>

          <div
            className={"fakepop2"}
            onClick={() => setCheckState(false)}
          ></div>
        </>
      ) : null}
      {warningPopUp ? (
        <>
          <div class="card-error">
            <svg
              class="wave-error"
              viewBox="0 0 1440 320"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M0,256L11.4,240C22.9,224,46,192,69,192C91.4,192,114,224,137,234.7C160,245,183,235,206,213.3C228.6,192,251,160,274,149.3C297.1,139,320,149,343,181.3C365.7,213,389,267,411,282.7C434.3,299,457,277,480,250.7C502.9,224,526,192,549,181.3C571.4,171,594,181,617,208C640,235,663,277,686,256C708.6,235,731,149,754,122.7C777.1,96,800,128,823,165.3C845.7,203,869,245,891,224C914.3,203,937,117,960,112C982.9,107,1006,181,1029,197.3C1051.4,213,1074,171,1097,144C1120,117,1143,107,1166,133.3C1188.6,160,1211,224,1234,218.7C1257.1,213,1280,139,1303,133.3C1325.7,128,1349,192,1371,192C1394.3,192,1417,128,1429,96L1440,64L1440,320L1428.6,320C1417.1,320,1394,320,1371,320C1348.6,320,1326,320,1303,320C1280,320,1257,320,1234,320C1211.4,320,1189,320,1166,320C1142.9,320,1120,320,1097,320C1074.3,320,1051,320,1029,320C1005.7,320,983,320,960,320C937.1,320,914,320,891,320C868.6,320,846,320,823,320C800,320,777,320,754,320C731.4,320,709,320,686,320C662.9,320,640,320,617,320C594.3,320,571,320,549,320C525.7,320,503,320,480,320C457.1,320,434,320,411,320C388.6,320,366,320,343,320C320,320,297,320,274,320C251.4,320,229,320,206,320C182.9,320,160,320,137,320C114.3,320,91,320,69,320C45.7,320,23,320,11,320L0,320Z"
                fill-opacity="1"
              ></path>
            </svg>

            <div class="icon-container-error">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
                stroke-width="0"
                fill="currentColor"
                stroke="currentColor"
                class="icon-error"
              >
                <path d="M256 48a208 208 0 1 1 0 416 208 208 0 1 1 0-416zm0 464A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM175 175c-9.4 9.4-9.4 24.6 0 33.9l47 47-47 47c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l47-47 47 47c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-47-47 47-47c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0l-47 47-47-47c-9.4-9.4-24.6-9.4-33.9 0z"></path>
              </svg>
            </div>
            <div class="message-text-container-error">
              <p class="message-text-error">Error message</p>
              <p class="sub-text-error">Sorry the trip is full </p>
            </div>
  
          </div>
          <div
            onClick={() => setWarningPopUp(false)}
            className={"fakepop"}
          ></div>
        </>
      ) : null}
    </div>
  );
}

export default AllTrips;
