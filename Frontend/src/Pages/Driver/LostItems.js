import React from 'react'
import "./LostItems.css"
import { useState, useEffect } from "react";
import axios from "axios";
function LostItems() {
  const userssn = sessionStorage.getItem('ssn');

  let [testState, setTestState] = useState({
    valid: false,
    final: false,
    req: false,
  });

  let [lostState, setLostState] = useState({
    trip_id: 0,
    item: "",
    quantity: 1,
    description: "",
  });
  let [doneTripsState, setDoneTripsState] = useState([]);
  let tipsList;














useEffect(() => {
  if (testState.req === true) {
    (async () => {
      try {
        const result = await fetch("http://localhost:6969/driver/get-started-trips",{
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ d_ssn: userssn }),
      });
      // const resultInjson = await result.json();
      // console.log(resultInjson.data);
      // setStatusState(resultInjson.data);
        //npm install -g json-server
        //& "C:\Users\Jo\AppData\Roaming\npm\json-server.cmd" db.json& "C:\Users\Jo\AppData\Roaming\npm\json-server.cmd" db.json

        // console.log(result.data);
        // const jsonResult = await result.json;
        // setDoneTripsState(result.data);
        const resultInjson = await result.json();
        console.log(resultInjson.data);
        tipsList = resultInjson.data.map(function (trip) {
          return (
            <option
              // selected="selected"
              key={trip.trip_id}
              id={trip.trip_id}
              className={"comboOption"}
              value={trip.trip_id}
            >
              {trip.trip_id}
            </option>
          );
        });
        console.log(tipsList);
        // setTese({ valid: true, trip: tipsList });
        setDoneTripsState(tipsList);
      } catch (error) {
        console.error(error);
      }
    })();
  }
}, [testState.req]);

const submitReq = async (event) => {
  event.preventDefault();

  if (lostState.trip_id != "ID" && lostState.trip_id != 0) {
    try {
      const result = await fetch("http://localhost:6969/driver/report-lost-item", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(lostState),
      });
      const resultInjson = await result.json();
      console.log(resultInjson);
    } catch (error) {
      console.error("Error adding user:", error);
    }

    setTestState({ ...testState, final: true });
    setLostState({   trip_id: 0, item: "", quantity: 1, description: "" });
  } else setTestState({ ...testState, valid: true });
};

return (
  <>
    <button
      onClick={() => setTestState({ ...testState, req: true })}
      className="buttonReq"
    >
      {" "}
      Lost&found
    </button>


    {testState.req ? (
      <>
        <form className="lostPopUp" onSubmit={(event) => submitReq(event)}>
          <div className="combowithlabel">
            <label className="LabelID" for="trips">
              Choose a Trip:
            </label>
            <select
              name="hi"
              required
              value={lostState.trip_id}
              onChange={(event) =>
                setLostState({ ...lostState, trip_id: event.target.value })
              }
              className="comboBox"
              id="trips"
            >
              {/* <option value="someOption">ds</option>
              <option value="otherOption">Other option</option> */}
              <option selected="selected">ID</option>
              {doneTripsState}
            </select>
          </div>

          <div className="inputwithlabel">
            <label className="LabelID" for="item">
              Item
            </label>
            <input
              required
              type="text"
              value={lostState.item}
              onChange={(event) =>
                setLostState({ ...lostState, item: event.target.value })
              }
              className="item"
              id="item"
            ></input>
          </div>

          <div className="inputwithlabel">
            <label className="LabelID" for="quantity">
              quantity
            </label>
            <input
              type="number"
              value={lostState.quantity}
              onChange={(event) =>
                setLostState({ ...lostState, quantity: event.target.value })
              }
              className="quantity"
              id="quantity"
              min="1"
            ></input>
          </div>

          <div className="inputwithlabel">
            <label className="LabelID" for="description">
              description
            </label>
            <textarea
              required
              value={lostState.description}
              onChange={(event) =>
                setLostState({
                  ...lostState,
                  description: event.target.value,
                })
              }
              className="description"
              id="description"
            ></textarea>
          </div>

          <button className="sendbutton"> Send</button>
        </form>
        <div
          className="formm"
          onClick={() => setTestState({ ...testState, req: false })}
        ></div>

        {testState.valid ? (
          <div className="response-id-popup "> FAILURE Wrong ID</div>
        ) : null}

        {testState.final ? (
          <div className="response-id-popup "> Suceess Send</div>
        ) : null}

        <div
          className={testState.final ? "formmsucc" : "formm1fail"}
          onClick={() =>
            setTestState({ ...testState, final: false, req: false })
          }
        ></div>
        <div
          className={testState.valid ? "formmsucc" : "formm1fail"}
          onClick={() => setTestState({ ...testState, valid: false })}
        ></div>
      </>
    ) : null}
  </>
)
}

export default LostItems
