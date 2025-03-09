import "./Trips.css";
import { useState, useEffect } from "react";
import imagnotifi from "./notification.png";
import imgnonotifi from "./Nonotification.png";
import Popup from "reactjs-popup";
import { Link, NavLink } from "react-router-dom";

const userssn = sessionStorage.getItem("ssn");

export default function Trips({ flagNotifiaction }) {
  let [popState, setPopState] = useState({
    openPop: false,
    Seen: false,
  });

  function OpenTrips() {
    setPopState({ ...popState, Seen: true, openPop: false });
  }
  function OpenPrivateTrips() {
    setPopState({ ...popState, Seen: true, openPop: false });
  }

  let [privateDriver, setPrivateDriver] = useState(false);
  let [manager, setManager] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const result = await fetch(
          "http://localhost:6969/driver/get-private-status",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ d_ssn: userssn }),
          }
        );
        const resultInjson = await result.json();
        setPrivateDriver(resultInjson.isPrivate);
        setManager(resultInjson.m_ssn);
      } catch (error) {
        console.error(error);
      }
    })();
  }, []);

  return manager || privateDriver ? (
    <div className="mainPage">
      <Popup
        open={popState.openPop}
        contentStyle={{ border: "0", background: "none" }}
        trigger={
          <img
            alt="Notification"
            role="button"
            className="imma"
            src={flagNotifiaction && !popState.Seen ? imagnotifi : imgnonotifi}
          />
        }
        onOpen={() => setPopState({ ...popState, openPop: true })}
        position="bottom center"
        onClose={() => {
          setPopState({ ...popState, openPop: false, Seen: true });
        }}
      >
        <div
          className="containerr"
          style={{ height: privateDriver&&manager ? "200px" :"100px" }}
        >
          {manager ?(
            <Link
              to="/Driver/Trips"
              className="items"
              onClick={() => OpenTrips()}
            >
              Trips
            </Link>
          ) : null}
          {privateDriver ?(
            <Link
              to="/Driver/PrivateTrips"
              className="item2"
              onClick={() => OpenPrivateTrips()}
            >
              Private
            </Link>
          ):null}
        </div>
      </Popup>
    </div>
  ) : null;
}
