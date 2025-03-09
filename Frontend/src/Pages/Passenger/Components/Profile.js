import React from "react";
import "./Profile.css";
import { useState, useEffect } from "react";


function Profile() {
  let [profileState, setProfileState] = useState({
    email: "",
    fname: "",
    mname: "",
    lname: "",
    is_private: false,
    manager_name: "",
    salary: null,
    shift: "",
    station_name: "",
    rate: "0",
  });
  const userssn = sessionStorage.getItem("ssn");
  const role = sessionStorage.getItem("userType");
  useEffect(() => {
    (async () => {
      try {
        const result = await fetch("http://localhost:6969/accounts/profile", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ssn: userssn , jobRole:role

          }),
        });
        const resultInjson = await result.json();
        setProfileState(resultInjson.data);
      } catch (error) {
        console.error(error);
      }
    })();
  }, []);

  return (
<div className="main-profile">
  <div className="profile-card-set" style={{ width: "100%", margin: "5px" , justifyContent: "center"}} >
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
      <h2 className="section-title-set"> My Profile </h2>

          <form>
            <div class="form-group-set">
              <div class="form-input-set">
                <label for="first-name" class="set">
                  First Name
                </label>
                {/* <h3 id="first-name" class="profile-name-set">
                    {profileState.fname}
                  </h3> */}
                <input
                  type="text"
                  id="lname"
                  class="set"
                  value={profileState.fname}
                  disabled
                />
              </div>
              <div class="form-input-set">
                <label for="lname" class="set">
                  Last Name
                </label>
                <input
                  type="text"
                  id="lname"
                  class="set"
                  value={profileState.lname}
                  disabled
                />
              </div>
            </div>
            <div class="form-group-set">
  
              <div class="form-input-set">
                <label for="email" class="set">
                  Email
                </label>
                <input
                  type="text"
                  id="email"
                  class="set"
                  value={profileState.email}
                  disabled
                />
              </div>
            </div>
          
    

            <div class="mt-5 text-center"></div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Profile;
