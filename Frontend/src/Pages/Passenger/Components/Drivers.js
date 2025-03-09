import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import StarRatings from "react-star-ratings"; // Importing the star ratings component
import "./Profile.css";

function Drivers() {
  const location = useLocation();
  let [profileState, setProfileState] = useState({
    email: "",
    fname: "",
    lname: "", // Added lname to avoid any undefined issue
    station_name: "",
    rate: null,
  });
  const userssn = location.state.value;

  useEffect(() => {
    (async () => {
      try {
        const result = await fetch("http://localhost:6969/accounts/profile", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ssn: userssn, jobRole: "Driver" }),
        });
        const resultInjson = await result.json();
        setProfileState(resultInjson.data);
      } catch (error) {
        console.error(error);
      }
    })();
  }, [userssn]);

  return (
    <div>
      <div className="main-profile">
        <div className="profile-card-set" style={{ justifyContent: "center" }}>
          <div className="myprofile-sidebar-set">
            <img
              className="profile-image-set"
              src="https://st3.depositphotos.com/15648834/17930/v/600/depositphotos_179308454-stock-illustration-unknown-person-silhouette-glasses-profile.jpg"
              alt="Profile-Image"
            />
            <h2 className="profile-name-set">{profileState.fname}</h2>
            <p className="profile-email-set">{profileState.email}</p>
          </div>
        </div>
        <div className="profile-card-set">
          <div className="profile-settings-set">
            <h2 className="section-title-set">My Profile</h2>
            <form>
              <div className="form-group-set">
                <div className="form-input-set">
                  <label htmlFor="first-name" className="set">
                    First Name
                  </label>
                  <input
                    type="text"
                    id="first-name"
                    className="set"
                    value={profileState.fname}
                    disabled
                  />
                </div>

                <div className="form-input-set">
                  <label htmlFor="last-name" className="set">
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="last-name"
                    className="set"
                    value={profileState.lname}
                    disabled
                  />
                </div>
              </div>
              <div className="form-group-set">
                <div className="form-input-set">
                  <label htmlFor="email" className="set">
                    Email
                  </label>
                  <input
                    type="text"
                    id="email"
                    className="set"
                    value={profileState.email}
                    disabled
                  />
                </div>
                <div class="form-input-set" style={{ flexDirection: "row" }}>
                  <label for="rate-star" class="set" style={{width:"30%", margin: "auto 0 auto 0" , marginleft: "0px", padding: "0px", left: "0px", textAlign: "left"}}> 
                    My rate
                  </label>
                  <div id="rate-star" style={{ margin: "auto", justifyContent: "flex-start", width: "70%" }}>
                    <StarRatings
                      rating={
                        profileState.rate === null
                          ? 0
                          : !isNaN(profileState.rate)
                          ? parseFloat(profileState.rate)
                          : 0
                      }
                      starRatedColor="gold"
                      numberOfStars={5}
                      name="rating"
                      starDimension="30px"
                      starSpacing="5px"
                    />
                  </div>
                </div>
              </div>
              {profileState.station_name !== "" && (
                <div className="form-input-set">
                  <label htmlFor="station_name" className="set">
                    Station Name
                  </label>
                  <input
                    type="text"
                    id="station_name"
                    className="set"
                    value={profileState.station_name}
                    disabled
                  />
                </div>
              )}

              <div className="mt-5 text-center"></div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Drivers;
