import "./PopUp.css";
import Button from "./Button";
import { useState } from "react";

export default function PopUp() {
  let [validState, setValidState] = useState(false);
  let [closeState, setcloseState] = useState(false);
  let [finalState, setFinalState] = useState(false);

  function submitReq(event) {
    event.preventDefault();
    // console.log(timeState.slice(0, 4)); // year
    // console.log(timeState.slice(5, 7)); //mont
    // console.log(timeState.slice(8, 10)); //day
    // if (now.getFullYear() <= +timeState.slice(0, 4)) {
    //   //pop up for error message
    //   if (+month <= +timeState.slice(5, 7)) {
    //     if (+day < +timeState.slice(8, 10)) {
    //       // assume you cannot have dayoff in the same day you must say before it
    //       // submit form suceess
    //       console.log("SUCCESS");
    //     } else {
    //       console.log("FAIL DUE TO DAY");
    //     }
    //   } else {
    //     console.log("FAIL DUE TO MONTH");
    //   }
    // } else {
    //   console.log("FAIL DUE TO YEAR");
    // }
    if (
      now.getFullYear() <= +timeState.slice(0, 4) &&
      +month <= +timeState.slice(5, 7) &&
      +day < +timeState.slice(8, 10)
    ) {
      console.log("SUCCESS");

      
      setFinalState(true);
       setcloseState(true);


    } else {
      console.log("Failure");
      setValidState(true);
    }
  }

  // let flatpickr = require("flatpickr");

  // flatpickr(".date", {});

  function test(event) {
    setValidState(false);
    // console.log(event.target.value);
    // // console.log(event);
    // const now = new Date();
    // console.log(now);
    // console.log(now.getDate());
    // console.log(now.getMonth() + 1); // 0 index
    // console.log(now.getFullYear());
    // let today=`${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`
    // console.log(today)
    console.log(timeState.slice(0, 4));
    console.log(timeState.slice(8, 10));
    console.log(timeState.slice(5, 7));
  }
  const now = new Date();
  let month;
  if (now.getMonth() + 1 / 10 < 1) month = `0${now.getMonth() + 1}`;
  else month = `${now.getMonth() + 1}`;
  let day;
  if (now.getDate() / 10 < 1) day = `0${now.getDate()}`;
  else day = `${now.getDate()}`;
  let today = `${now.getFullYear()}-${month}-${day}`;
  let [timeState, setTimeState] = useState(today);



  // document.click(function(event){(validState)? setValidState(false):setValidState(false)});

  return (
    <>
      <form
        // className="popUp"
         className={closeState ? "popUpHidden" : "popUp"}
        onSubmit={(event) => submitReq(event)}
      >
        <input
          value={timeState}
          onChange={(event) => setTimeState(event.target.value)}
          onClick={(event) => test(event)}
          className="date"
          type="date"
        ></input>
        <Button> {"Request "}</Button>
      </form>

      {validState ? (
        <div className="failurepopUp">
          {" "}
          FAILURE Wrong Date 
        </div>
      ) : // <div className="failurepopUp">SUCCESS</div>
      null}


{finalState ? (
        <div className="failurepopUp">
          {" "}
          Suceess  Date 
        </div>
      ) : // <div className="failurepopUp">SUCCESS</div>
      null}





<div   className={finalState?"formmfail":"formm1fail"} onClick={()=>setFinalState(false)}></div>
<div   className={validState?"formmfail":"formm1fail"} onClick={()=>setValidState(false)}></div>
<div   className={closeState?"formm1":"formm"} onClick={()=>setcloseState(true)}></div>

      {/* <Flatpickr 
  class="inputs"
  data-date-format="Y-m-d"
  placeholder="Check-in"
  options={{
    minDate: "today",
    altInput: true,
    altFormat: "F j, Y",
    dateFormat: "Y-m-d",
    enableTime: true
  }}
  // onChange={(date) => setCheck_In(date[0])}
/> */}
    </>
  );
}
