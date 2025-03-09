import "./PrivateTrips.css";
import { useState, useEffect } from "react";
import axios from "axios";
import DataTable, { createTheme } from "react-data-table-component";
function PrivateTrips() {
  const userssn = sessionStorage.getItem('ssn');
  let [warningPopUp, setWarningPopUp] = useState(false);
  let tripData = {
    Accept: false, // mean accept and start if false mean reject if true means accept and start
    estimated_time: 1,
    order_id: 0,
    price: 0,
    d_ssn: userssn

  };
  const columns = [
    {
      name: "ID",
      selector: (row) => row.order_id,
      sortable: true,
    },
    {
      name: "Source",
      selector: (row) => row.source,
    },
    {
      name: "Destination",
      selector: (row) => row.destination,
    },
    {
      name: "Price",
      selector: (row) => row.price,
    },

    {
      name: "Date",
      selector: (row) => row.date.slice(0, 10),
    },

    {
      name: "Reject",
      maxWidth: "100px",
      cell: (row) => (
        <button
          className="butt"
          onClick={() => {handleCheckTrip( row) ; HandleReject(row);}}
          style={{
            padding: "5px 10px",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Reject
        </button>
      ),
      ignoreRowClick: true, // Prevents row click events when button is clicked
      allowOverflow: true, // Allows the button to overflow if needed
      button: true, // Identifies the column as a button
    },
    {
      name: "Accept",
      maxWidth: "100px",
      cell: (row) => (
        <button
          className="butt1"
          onClick={() =>{handleCheckTrip( row);  HandleAccept(row);}}
          style={{
            padding: "5px 10px",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Accept
        </button>
      ),
      ignoreRowClick: true, // Prevents row click events when button is clicked
      allowOverflow: true, // Allows the button to overflow if needed
      button: true, // Identifies the column as a button
    },
    {
      name: "EstimatedTime (hr)",
      // selector: (row) => row.EstimatedTime,
      minWidth: "150px",
      cell: (row) => (
        <input
          value={row.estimated_time}
          // value={tripState.Time}
          onChange={(event) => HandleTime(event, row)}
          //   setTripState({ ...tripState, Time: event.target.value })
          // }
          className="try"
          type="number"
          id="quantity"
          name="quantity"
          min="1"
          max="24"
        ></input>
      ),
      ignoreRowClick: true, // Prevents row click events when button is clicked
      allowOverflow: true, // Allows the button to overflow if needed
      button: true, // Identifies the column as a button
    },
  ];

  let [recievedData, setRecievedData] = useState([]);


  function HandleTime(event, Row) {
    const filteredData = recievedData.map((row) => {
      if (row.order_id === Row.order_id)
        if (+event.target.value > 24)
          row.estimated_time = "24";
        else if (+event.target.value < 0)
          row.estimated_time = "1";
        else
          row.estimated_time = event.target.value;
      return row;
    });

    console.log(filteredData);
    setRecievedData(filteredData);
  }










  function HandleAccept(Row) {
    const filteredData = recievedData.filter((row) => row.order_id !== Row.order_id); // Filter out the row by id
    // send data to back
    tripData.Accept = true;
    tripData.estimated_time = Row.estimated_time;
    tripData.order_id = Row.order_id;
    tripData.price = Row.price;

    handleTrip(tripData);
    setRecievedData(filteredData); // Update state to remove the deleted row
  }
  function HandleReject(Row) {
    console.log(Row);
    const filteredData = recievedData.filter((row) => row.order_id !== Row.order_id); // Filter out the row by id
    // send data to back
    tripData.Accept = false;
    tripData.estimated_time = 0;
    tripData.order_id = Row.order_id;
    tripData.price = Row.price;
    handleTrip(tripData);
    setRecievedData(filteredData); // Update state to remove the deleted row
  }

  const handleTrip = async (sendData) => {
    console.log(sendData);
    try {
      const result = await fetch("http://localhost:6969/driver/accept-reject-private-trip", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(sendData),
      });
      const resultInjson = await result.json();
      console.log(resultInjson);
    } catch (error) {
      console.error("Error handle trip:", error);
    }
  };

  const handleCheckTrip = async (Row) => {
    try {
      const result = await fetch("http://localhost:6969/driver/get-private-trips", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ d_ssn: userssn }),
      });
      const resultInjson = await result.json();
      // setRecievedData(resultInjson.data);
      const newData = resultInjson.data.filter((ele) => {
        return ele.order_id === Row.order_id;
      });
      if (newData.length === 0) {
        setWarningPopUp(true);
      }
      console.log(resultInjson.data);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    (async () => {
      try {
        const result = await fetch("http://localhost:6969/driver/get-private-trips", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ d_ssn: userssn }),
        });
        const resultInjson = await result.json();
        setRecievedData(resultInjson.data);
        console.log(resultInjson.data);
      } catch (error) {
        console.error(error);
      }
    })();
  }, []);


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
  // createTheme('dark', {
  //   background: {
  //     default: 'transparent',
  //   },
  // });

  //   const ExpandedComponent = ({ data }) => (
  //     <pre>{JSON.stringify(data, null, 2)}</pre>
  //   );

  return (
    <div style={{ height: "fit-content" }}>
      {/* <div className="header">
        All Private Trips from Manager to this driver
      </div> */}

      <div className="containerrr">
        {/* <input type="text"></input> */}
        <DataTable
          title="Private Trips"
          columns={columns}
          data={recievedData}
          theme="solarized"
          // selectableRows
          fixedHeader
          pagination
          //   expandableRows
          //   expandableRowsComponent={ExpandedComponent}
        />
      </div>
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
              <p class="sub-text-error">Sorry the trip has already been taken  </p>
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

export default PrivateTrips;
