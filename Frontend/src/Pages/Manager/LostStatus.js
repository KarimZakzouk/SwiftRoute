import React from "react";
import DataTable, { createTheme } from "react-data-table-component";
import { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";

function RequestStatus() {
  const userID = sessionStorage.getItem("ssn");
  let [statusState, setStatusState] = useState([]);
  useEffect(() => {
    (async () => {
      try {
        const result = await fetch(
          "http://localhost:6969/manager/getLostStatus",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ m_ssn: userID }),
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

  const columns = [
    {
      name: "Trip Id",
      cell: (row) => row.tripid,
    },
    {
      name: "Source",
      cell: (row) => (
        <NavLink
          to="/manager/Station"
          className="links"
          state={{ value: row.sourceid }}
        >
          {row.sourcestationname}
        </NavLink>
      ),
    },
    {
      name: "Destination",
      cell: (row) => (
        <NavLink
          to="/manager/Station"
          className="links"
          state={{ value: row.destinationid }}
        >
          {row.destinationstationname}
        </NavLink>
      ),
    },

    {
      name: "Price",
      selector: (row) => row.price,
      // maxWidth: "100px",
      sortable: true,
    },
    {
      name: "Date",
      selector: (row) => row.date.slice(0, 10),
    },
    {
      name: "EstimatedTime (hr)",
      selector: (row) => row.estimated_time,
    },
    {
      name: "Item",
      selector: (row) => row.item,
    },
    {
      name: "quantity",
      selector: (row) => row.quantity,
    },
    {
      name: "description",
      selector: (row) => row.description,
    },
    {
      name: "Driver",
      cell: (row) => (
        <NavLink
          to="/manager/Driver"
          className="links"
          state={{ value: row.driverssn }}
        >
          {row.driverfirstname}
        </NavLink>
      ),
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
    <div style={{ height: "fit-content" }}>
      <div className="containerrr">
        <DataTable
          title=" Lost Items Status"
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
      </div>
    </div>
  );
}

export default RequestStatus;
