import "./Attend.css";
import { useState, useEffect } from "react";
export default function Attend() {
  let [appearState, setAppearState] = useState({
    appear: true,
    final: false,
  });

  const userssn = sessionStorage.getItem('ssn');

  useEffect(() => {
    (async () => {
      try {
        const result = await fetch("http://localhost:6969/driver/get-attendance" , {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ d_ssn: userssn }),
        } );
        const resultInjson = await result.json();
        setAppearState({...appearState,appear:resultInjson.attend});
      } catch (error) {
        console.error(error);
      }
    })();
  }, []);







  const HandleReq = async () => {
    const sendData = { d_ssn: userssn, Attend: true };
    setAppearState({ ...appearState, final: true });

    // send reason
    try {
      const result = await fetch("http://localhost:6969/driver/mark-attendance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(sendData),
      });
      const resultInjson = await result.json();
    } catch (error) {
      console.error("Error adding user:", error);
    }

    // check if fail due to arrive late or not important

  };
  // style={{display:appearState ? "flex" : "none"}}
  return (
    <div className="containerAttend" style={{ visibility: appearState.appear ? "visible" : "hidden" }}>
      <span onClick={() => HandleReq()} >Mark Attendance</span>



      {appearState.final ? (
        <>
          <div className="fail-popUp"> Suceess Attend</div>
          <div
            className={"success-attend-popup"}
            onClick={() =>
              setAppearState({ ...appearState, final: false, appear: false })
            }
          ></div>
        </>
      )
        : null}




    </div>
  );
}
