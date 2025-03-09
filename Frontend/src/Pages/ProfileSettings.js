import React, { useState, useEffect  } from "react";
import "./ProfileSettings.css";
import {  useLocation } from "react-router-dom";

function ProfileSettings() {
    const location = useLocation();
  let [profileState, setProfileState] = useState({
    email: "",
    fname: "",
    mname: "",
    lname: "",
    is_private: null,
  });

  let [prevProfileState, setPrevProfileState] = useState({
    email: "",
    fname: "",
    mname: "",
    lname: "",
    is_private: false,
  });

  let [validState, setVaildState] = useState({
    success: "",
    error: "",
  });

  const userssn = sessionStorage.getItem("ssn");
  const role=sessionStorage.getItem("userType");
  useEffect(() => {
    (async () => {
      try {
        const result = await fetch(
          "http://localhost:6969/accounts/profile",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ ssn: userssn ,jobRole:role }),
          }
        );
        const resultInjson = await result.json();
        setPrevProfileState(resultInjson.data);
        setProfileState({
          ...profileState,
          is_private: resultInjson.data.is_private,
        });
      } catch (error) {
        console.error(error);
      }
    })();
  }, [validState]);

  const sendData = async () => {
    
    try {
      const result = await fetch(
        "http://localhost:6969/accounts/profile",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ssn: userssn,
            data: profileState,
            jobRole:role,
          }),
        }
      );
      const resultInjson = await result.json();
      if (resultInjson.success === false)
        setVaildState({
          error: resultInjson.message,
          success: "",
        }); // error: resultInjson.suceess
      else {
        setVaildState({ error: "", success: resultInjson.message }); //success: resultInjson.suceess
        setProfileState({
          email: "",
          fname: "",
          mname: "",
          lname: "",
          is_private: null,
        });
      }


    } catch (error) {
      console.error("Error adding user:", error);
    }
  };

  function handleSubmit(event) {
    event.preventDefault();
console.log("fdfdfd");
    sendData();
  }

  return (
    <div>
      <div  class="container-set">
        <div class="profile-card-set">
          <div class="profile-sidebar-set">
            <img
              class="profile-image-set"
              src="https://st3.depositphotos.com/15648834/17930/v/600/depositphotos_179308454-stock-illustration-unknown-person-silhouette-glasses-profile.jpg"
              alt="Profile-Image"
            />
            <h2 class="profile-name-set">{prevProfileState.fname}</h2>
            <p class="profile-email-set">{prevProfileState.email}</p>
          </div>

          <div class="profile-settings-set">
            <h2 class="section-title-set">Profile Settings</h2>
            <form onSubmit={(event)=>handleSubmit(event)} >
              <div class="form-group-set">
                <div class="form-input-set">
                  <label for="first-name" class="set">
                    fname
                  </label>
                  <input
                    type="text"
                    pattern="[A-Za-z\s]+" // HTML validation pattern
                     title="Please enter only letters."
                    id="first-name"
                    placeholder={prevProfileState.fname}
                    class="set"
                    value={profileState.fname}
                    onChange={(event) =>
                      setProfileState({
                        ...profileState,
                        fname: event.target.value,
                      })
                    }
                  />
                </div>
                 {location.pathname !== "/Passenger/ProfileSettings"  ?
                <div class="form-input-set">
                  <label for="mname" class="set">
                    mname
                  </label>
                  <input
                    type="text"
                pattern="[A-Za-z\s]+" // HTML validation pattern
              title="Please enter only letters."
                    id="mname"
                    placeholder={prevProfileState.mname}
                    class="set"
                    value={profileState.mname}
                    onChange={(event) =>
                      setProfileState({
                        ...profileState,
                        mname: event.target.value,
                      })
                    }
                  />
                </div>
                :null}
              </div>
              <div class="form-group-set">
                <div class="form-input-set">
                  <label for="lname" class="set">
                    lname
                  </label>
                  <input
                    type="text"
                pattern="[A-Za-z\s]+" // HTML validation pattern
              title="Please enter only letters."
                    id="lname"
                    placeholder={prevProfileState.lname}
                    class="set"
                    value={profileState.lname}
                    onChange={(event) =>
                      setProfileState({
                        ...profileState,
                        lname: event.target.value,
                      })
                    }
                  />
                </div>
                <div class="form-input-set">
                  <label for="email" class="set">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    placeholder={prevProfileState.email}
                    class="set"
                    value={profileState.email}
                    onChange={(event) =>
                      setProfileState({
                        ...profileState,
                        email: event.target.value,
                      })
                    }
                  />
                </div>
              </div>
              {location.pathname === "/Driver/ProfileSettings"  ?
              <div class="form-group-set  form-group-private-set">
                <label for="is_private" class="set">
                  Private Driver
                </label>
                <label id="is_private" class="container-chkbox">
                  <input
                    type="checkbox"
                    checked={
                      profileState.is_private === null
                        ? prevProfileState.is_private
                        : profileState.is_private
                    }
                    onChange={(event) => {
                      setProfileState({
                        ...profileState,
                        is_private: event.target.checked,
                      });
                    }}
                  />
                  <div class="checkmark-chkbox"></div>
                </label>
              </div> : null}

              <div class="mt-5 text-center">
                <button
                  class="btn btn-primary profile-button-set"
                      
                >
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      {validState.error !== "" ? (
        <>
          <div className="popup-pass"> {validState.error}</div>
          <div
            className="formm-pass"
            onClick={() => {
              setVaildState({ ...validState, error: "" });
            }}
          ></div>
        </>
      ) : validState.success !== "" ? (
        <>
          <div className="popup-pass"> {validState.success}</div>
          <div
            className="formm-pass"
            onClick={() => {
              setVaildState({ ...validState, success: "" });
            }}
          ></div>
        </>
      ) : null}
    </div>
  );
}

export default ProfileSettings;
