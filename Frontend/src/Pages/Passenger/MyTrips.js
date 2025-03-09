import React from "react";
import "./MyTrips.css";
import { useState, useEffect } from "react";
import DataTable, { createTheme } from "react-data-table-component";
import { Link, NavLink, useLocation } from "react-router-dom";
export default function MyTrips() {
  let [recievedData, setRecievedData] = useState([]);
  const userID = sessionStorage.getItem("ssn");

  useEffect(() => {
    (async () => {
      try {
        const result = await fetch(
          "http://localhost:6969/passenger/getMyTrips",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ p_id: userID }),
          }
        );
        const resultInjson = await result.json();
        console.log(resultInjson.data);
        setRecievedData(resultInjson.data);
      } catch (error) {
        console.error(error);
      }
    })();
  }, []);

  const sendFav = async (sendData) => {
    try {
      const result = await fetch("http://localhost:6969/passenger/setFavouriteTrip", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(sendData),
      });
      const resultInjson = await result.json();
      console.log(resultInjson);
    } catch (error) {
      console.error("Error adding user:", error);
    }
  };

  function handlestation(row) {
    console.log(row);
  }
  function handleDriver(row) {
    console.log(row);
  }
  function HandleFav(event, row) {
    // console.log(event,row);
    // row.is_favourite=! row.is_favourite;
    sendFav({ p_id: userID, t_id: row.t_id, isFavourite: !row.is_favourite });
    let newData = recievedData.map((ele) => {
      if (ele.t_id === row.t_id) ele.is_favourite = !ele.is_favourite;
      return {...ele};
    });

    setRecievedData(newData);
    // console.log({
    //   p_id: userID,
    //   t_id: row.t_id,
    //   is_favourite: row.is_favourite,
    // });
  }
  const caseInsensitiveSort = (rowA, rowB) => {
    const a = rowA.is_favourite;
    const b = rowB.is_favourite;
  
    if (a ===true&&b===false) 
      return 1;
    
    if (a ===false&&b===true) 
      return -1;
    
    if(a ===true&&b===true)
      return 1;
    if(a ===false&&b===false)
    return 0;
  };
  const columns = [
    // {
    //   name: "ID",
    //   selector: (row) => row.id,
    //   sortable: true,
    // },
    {
      name: "Source",
      cell: (row) => (
        <NavLink
          to="/Passenger/Station"
          className="links"
          // onClick={() => handlestation(row)}
          state={{ value: row.source_id }}
        >
          {row.source}
        </NavLink>
      ),
      // selector: (row) => row.Source,
      // (row) => ({ style={{backgroundColor:  'pink'}}}),
    },
    {
      name: "Destination",
      cell: (row) => (
        <NavLink
          to="/Passenger/Station"
          className="links"
          // onClick={() => handlestation(row)}
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
          // onClick={() => handleDriver(row)}
          state={{ value: row.driver_ssn }}
        >
          {row.driver_fname}
        </NavLink>
      ),
    },
    {
      name: "Price",
      selector: (row) => row.price,
      sortable: true,
    },
    {
      name: "Rate",
      selector: (row) => row.rate,
      sortable: true,
    },
    {
      name: "Fav",
      sortable: true,
      sortFunction: caseInsensitiveSort,

      //  minWidth: "150",
      // minHieght: "150",

      /* From Uiverse.io by barisdogansutcu */
      cell: (row) => (
        <>
          <input
            value="favorite-button"
            name="favorite-checkbox"
            id="favorite"
            type="checkbox"
          />
          <label class="containerfav" for="favorite">
            <svg
              class="feather feather-heart"
              stroke-linejoin="round"
              stroke-linecap="round"
              stroke-width="2"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 24 24"
              height="24"
              width="24"
              xmlns="http://www.w3.org/2000/svg"
              style={{
                fill: `${
                  row.is_favourite === true ? "hsl(0deg 100% 50%)" : ""
                }`,
                cursor: "pointer",
              }}
              onClick={(event) => HandleFav(event, row)}
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
          </label>
        </>
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

  ////
  const data = [
    {
      id: 1,

      Source: "Hello",
      Destination: "Yousef",
      Driver: "Adel",
      Price: 100,
      Date: "15/2",
      EstimatedTime: 2,
      SourceId: "120",
      DestinationId: "124",
    },
    {
      id: 2,

      Source: "yousef2",
      Destination: "Nsoo7y2",
      Driver: "Nsoo7y21",
      Price: 110,
      Date: "15/2",
      EstimatedTime: 2,
    },
    {
      id: 3,

      Source: "yousef3",
      Destination: "Nsoo7y3",
      Driver: "Nsoo7y31",
      Price: 130,
      Date: "15/2",
      EstimatedTime: 2,
    },
    {
      id: 4,

      Source: "yousef1",
      Destination: "Nsoo7y1",
      Driver: "Nsoo7y1",
      Price: 140,
      Date: "15/2",
      EstimatedTime: 2,
    },
    {
      id: 5,

      Source: "yousef2",
      Destination: "Nsoo7y2",
      Driver: "Nsoo7y2",
      Price: 150,
      Date: "15/2",
      EstimatedTime: 2,
    },
    {
      id: 6,

      Source: "yousef3",
      Destination: "Nsoo7y3",
      Driver: "Nsoo7y3",
      Price: 150,
      Date: "15/2",
      EstimatedTime: 2,
    },
    {
      id: 7,

      Source: "yousef1",
      Destination: "Nsoo7y1",
      Driver: "Nsoo7y1",
      Price: 150,
      Date: "15/2",
      EstimatedTime: 2,
    },
    {
      id: 8,

      Source: "yousef2",
      Destination: "Nsoo7y2",
      Driver: "Nsoo7y2",
      Price: 150,
      Date: "15/2",
      EstimatedTime: 2,
    },
    {
      id: 9,

      Source: "yousef3",
      Destination: "Nsoo7y3",
      Driver: "Nsoo7y3",
      Price: 150,
      Date: "15/2",
      EstimatedTime: 2,
    },
    {
      id: 10,

      Source: "yousef1",
      Destination: "Nsoo7y1",
      Driver: "Nsoo7y1",
      Price: 150,
      Date: "15/2",
      EstimatedTime: 2,
    },
    {
      id: 11,

      Source: "yousef2",
      Destination: "Nsoo7y2",
      Driver: "Nsoo7y2",
      Price: 150,
      Date: "15/2",
      EstimatedTime: 2,
    },
    {
      id: 12,

      Source: "yousef3",
      Destination: "Nsoo7y3",
      Driver: "Nsoo7y3",
      Price: 150,
      Date: "15/2",
      EstimatedTime: 2,
    },
    {
      id: 13,

      Source: "yousef1",
      Destination: "Nsoo7y1",
      Driver: "Nsoo7y1",
      Price: 150,
      Date: "15/2",
      EstimatedTime: 2,
    },
    {
      id: 14,

      Source: "yousef2",
      Destination: "Nsoo7y2",
      Driver: "Nsoo7y2",
      Price: 150,
      Date: "15/2",
      EstimatedTime: 2,
    },
    {
      id: 15,

      Source: "yousef3",
      Destination: "Nsoo7y3",
      Driver: "Vamoos",
      Price: 20,
      Date: "15/2",
      EstimatedTime: 2,
    },
  ];

  ///

  return (

      <div className="containerrr">
      <DataTable
        title="Passenger Trips"
        columns={columns}
        //   data={recievedData}
        data={recievedData}
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

  );
}
