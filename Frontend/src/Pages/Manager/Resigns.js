import React from "react";
import DataTable, { createTheme } from "react-data-table-component";
import { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";

function Resigns() {
  const userID = sessionStorage.getItem("ssn");
  let [statusState, setStatusState] = useState([]);
  useEffect(() => {
    (async () => {
      try {
        const result = await fetch(
          "http://localhost:6969/manager/getResignedDrivers",
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
      name: "Date",
      selector: (row) => row.date.slice(0, 10),
    },
 
    {
      name: "Reason",
      selector: (row) => row.reason,
    },
    {
      name: "Driver",
      cell: (row) => (
        <NavLink
          to="/manager/Driver"
          className="links"
          state={{ value: row.d_ssn }}
        >
          {row.d_fname}
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
          title=" Resigns"
          columns={columns}
          data={statusState}
          theme="solarized"
          fixedHeader
          pagination
          customStyles={customStyles}
          paginationPerPage={6}
        />
      </div>
    </div>
  );
}

export default Resigns;
