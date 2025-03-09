import "./ReqDayoff.css";
// import Button from "./Button";
import React from "react";
import { useState } from "react";

export default function ReqDayoff() {
  const now = new Date();
  let month;
  if (now.getMonth() + 1 / 10 < 1) month = `0${now.getMonth() + 1}`;
  else month = `${now.getMonth() + 1}`;
  let day;
  if (now.getDate() / 10 < 1) day = `0${now.getDate()}`;
  else day = `${now.getDate()}`;
  let today = `${now.getFullYear()}-${month}-${day}`;
  let [testState, setTestState] = useState({
    time: today,
    valid: false,
    final: false,
    req: false,
    error: false
  });
  const userssn = sessionStorage.getItem('ssn');
  const handleRequist = async () => {
    try {
      const result = await fetch("http://localhost:6969/driver/request-day-off", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({d_ssn: userssn ,date:testState.time}),
      });
      const resultInjson = await result.json();
      if (resultInjson.success === false)
        setTestState({ ...testState, error: true });
      else
        setTestState({ ...testState, final: true });
    } catch (error) {
      console.error("Error Request Day OFF:", error);
    }
  };

  function submitReq(event) {
    event.preventDefault();
    if (now.getFullYear() < +testState.time.slice(0, 4)) {
      handleRequist();
    }
    else {
      if (now.getFullYear() == testState.time.slice(0, 4)) {
        if (
          +month < +testState.time.slice(5, 7)
        )
          handleRequist();
        else {
          if (
            +month == +testState.time.slice(5, 7)
          ) {
            if (+day < +testState.time.slice(8, 10))
              handleRequist();
            else
              setTestState({ ...testState, valid: true });
          }
          else
            setTestState({ ...testState, valid: true });

        }
      }
      else
        setTestState({ ...testState, valid: true });
    }
  }



  return (
    <>
      <button
        className="buttonReq"
        onClick={() => setTestState({ ...testState, req: true })}
      >
        {"Request Day OFF"}
      </button>
      {/* {testState.req ? <PopUp /> : null} */}

      {testState.req ? (
        <>
          <form className="popUp" onSubmit={(event) => submitReq(event)}>
            <input
              value={testState.time}
              onChange={(event) =>
                setTestState({ ...testState, time: event.target.value })
              }
              className="date"
              type="date"
            ></input>
            <button className="submit-button"> {"Request "}</button>
          </form>

          {testState.valid ? (
            <div className="response-popUp"> Failure Wrong Date</div>
          ) : null}

          {testState.error ? (
            <div className="response-popUp"> Already Requested Date</div>
          ) : null}

          {testState.final ? (
            <div className="response-popUp">  We will send you a response</div>
          ) : null}

          <div
            className={testState.final ? "success-form" : "fail-form"}
            onClick={() =>
              setTestState({ ...testState, final: false, req: false ,error:false})
            }
          ></div>
          <div
            className={testState.valid || testState.error ? "success-form" : "fail-form"}
            onClick={() => setTestState({ ...testState, valid: false ,final: false ,error:false})}
          ></div>
          <div
            className="back-form"
            onClick={() => {
              setTestState({ ...testState, req: false ,error:false});
            }}
          ></div>
        </>
      ) : null}
    </>
  );
}
