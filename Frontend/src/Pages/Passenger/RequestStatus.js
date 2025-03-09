import React from "react";
import DataTable, { createTheme } from "react-data-table-component";
import { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import "./RequestStatus.css";
function RequestStatus() {
  const userID = sessionStorage.getItem("ssn");
  let [tripData, setTripData] = useState({
    order_id: 0,
    p_id: userID,
  });
  let [statusState, setStatusState] = useState([]);
  useEffect(() => {
    (async () => {
      try {
        const result = await fetch(
          "http://localhost:6969/passenger/getStatusPrivateTrips",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ p_id: userID }),
          }
        );
        const resultInjson = await result.json();
        console.log(resultInjson);
        setStatusState(resultInjson.data);
      } catch (error) {
        console.error(error);
      }
    })();
  }, []);

  const cancelTrip = async (row) => {
    try {
      const result = await fetch(
        "http://localhost:6969/passenger/removePrivateTrip",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ order_id: row.order_id, p_id: userID }),
        }
      );
      const resultInjson = await result.json();
console.log(resultInjson);
      if (resultInjson.removed) {
        const filteredData = statusState.filter(
          (Row) => Row.order_id !== row.order_id
        ); // Filter out the row by id
        setStatusState(filteredData);
      }
    } catch (error) {
      console.error("Error adding user:", error);
    }
  };

  const columns = [
    {
      name: "Source",
      cell: (row) => row.source,
    },
    {
      name: "Destination",
      cell: (row) => row.destination,
    },


    {
      name: "Price",
      selector: (row) => row.price,
      // maxWidth: "100px",
      sortable: true,
    },
    {
      name: "Date",
      selector: (row) => row.date,
    },
    {
      name: "EstimatedTime (hr)",
      selector: (row) => row.estimated_time,
    },
    {
        name: "Driver",
        cell: (row) => (
          <NavLink
            to="/Passenger/Drivers"
            className="links"
            state={{ value: row.d_ssn }}
          >
            {row.driver_fname}
          </NavLink>
        ),
      },

    {
      name: "Status",
      minWidth: "300px",
      minHieght: "200px",
      cell: (row) => (
        row.d_ssn!==null?
        (
        <span> Accepted</span>)
        :
        (
        <button
          onClick={() => {
            cancelTrip(row);
          }}
          class="animated-button-cancel"
        >
          <svg
            viewBox="0 0 24 24"
            class="arr-2-cancel"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z"></path>
          </svg>
          <span class="text-cancel">Cancel Trip</span>
          <span class="circle-cancel"></span>
          <svg
            viewBox="0 0 24 24"
            class="arr-1-cancel"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z"></path>
          </svg>
        </button>
        )
      ),
      ignoreRowClick: true, // Prevents row click events when button is clicked
      allowOverflow: true, // Allows the button to overflow if needed
      button: true, // Identifies the column as a button
  



    },
  ];

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

  return (
    <DataTable
      title=" Private Trips Status"
      columns={columns}
      data={statusState}
      theme="solarized"
      // selectableRows
      fixedHeader
      pagination
      customStyles={customStyles}
      paginationPerPage={6}
      //   expandableRows
      //   expandableRowsComponent={ExpandedComponent}
    />
  );
}

export default RequestStatus;
