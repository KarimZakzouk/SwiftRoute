import "./Resign.css";
import { useState, useEffect } from "react";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";

export default function Resigon() {
  let [reasonState, setReasonState] = useState("");
  const [PopupOpen, setPopupOpen] = useState(false);

  const handleSubmit = async () => {
    const userssn = sessionStorage.getItem('ssn');
    const sendState = { d_ssn: userssn, Reason: reasonState };
    // send reason  
    try {
      const result = await fetch("http://localhost:6969/driver/resign", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(sendState),
      });
      const resultInjson = await result.json();
    } catch (error) {
      console.error("Error Resign :", error);
    }
    setReasonState("");
    window.location.reload();
    //setPopupOpen(false);   check
  };
  return (
    <div>
      {/* <h4> Resign </h4> */}
      <Popup
        contentStyle={{ border: "0", background: "none" }}
        trigger={<button className="buttonReq" onClick={()=>setPopupOpen(!PopupOpen)}> Resign </button>}
        position="bottom center"
        open={PopupOpen}
        onClose={() => {
          setReasonState(""); // Close popup
        }} // Your extra function
      >
        <form
          method="post"
          className="popUpp"
          onSubmit={(event) => {
            handleSubmit();
            event.preventDefault();
          }}
        >
          <span className="reasonfont"> Write Your Reason</span>
          {/* <input type="text" size="10" ></input> */}
          <textarea
            value={reasonState}
            onChange={(event) => setReasonState(event.target.value)}
            style={{
              height: "60%",
              padding: "5px",
              backgroundColor: "#ecf0f1",
              outlineColor: "#1abc9c"
            }}
            required
          ></textarea>
          <button
            className="buttonReq"
            style={{ alignSelf: "center" }}
          >
            {" "}
            Resign
          </button>
        </form>
      </Popup>
    </div>
  );
}
