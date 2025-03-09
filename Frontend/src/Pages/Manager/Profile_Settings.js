import React, { useState, useEffect } from "react";

function ManagerProfileSettings() {
  const [profileData, setProfileData] = useState({
    fname: "",
    mname: "",
    lname: "",
    email: "",
    verified_by: "",
  });

  const [initialProfileData, setInitialProfileData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [profileLoaded, setProfileLoaded] = useState(false);

  const fetchProfileData = async () => {
    const userssn = sessionStorage.getItem("ssn");
    if (!userssn) {
      alert("No SSN found in session storage");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch("http://localhost:6969/manager/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ssn: userssn }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch profile data");
      }

      const result = await response.json();
      const profile = {
        ssn: sessionStorage.getItem("m_ssn"),
        fname: result.data.fname,
        mname: result.data.mname,
        lname: result.data.lname,
        email: result.data.email,
      };

      setProfileData(profile);
      setInitialProfileData(profile);
      setProfileLoaded(true);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setError("Failed to load profile data");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setProfileData({
      ...profileData,
      [name]: value,
    });
  };


  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccessMessage("");

    try {
      const response = await fetch("http://localhost:6969/manager/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ssn: sessionStorage.getItem("ssn"),
          fname: profileData.fname,
          mname: profileData.mname,
          lname: profileData.lname,
          email: profileData.email,
          is_private: profileData.is_private,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setSuccessMessage("Profile updated successfully!");
        setInitialProfileData({ ...profileData }); // Reset initial profile data

      } else {
        if (result.message === "Email already exists.") {
          setError("The email you entered already exists.");
        } else {
          setError(result.message || "Failed to update profile");
        }
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setError("An unexpected error occurred while updating the profile.");
    }
  };

  const isProfileChanged =
    JSON.stringify(profileData) !== JSON.stringify(initialProfileData);

  return (
    <div className="container-set">
      {loading ? (
        <div>Loading...</div>
      ) : !profileLoaded ? (
        <div className="profile-card-set">
          <div className="profile-settings-set">
            <h2 className="section-title-set">Error loading profile</h2>
            <p>{error}</p>
          </div>
        </div>
      ) : (
        <div className="profile-card-set">
          <div className="profile-sidebar-set">
            <img
              className="profile-image-set"
              src="https://st3.depositphotos.com/15648834/17930/v/600/depositphotos_179308454-stock-illustration-unknown-person-silhouette-glasses-profile.jpg"
              alt="Profile-Image"
            />
            <h2 className="profile-name-set">
              {profileData.fname} {profileData.lname}
            </h2>
            <p className="profile-email-set">{profileData.email}</p>
          </div>

          <div className="profile-settings-set">
            <h2 className="section-title-set">Profile Settings</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group-set">
                <div className="form-input-set">
                  <label htmlFor="fname" className="set">
                    First Name
                  </label>
                  <input
                    type="text"
                    id="fname"
                    name="fname"
                    value={profileData.fname}
                    onChange={handleChange}
                    className="set"
                  />
                </div>
                <div className="form-input-set">
                  <label htmlFor="mname" className="set">
                    Middle Name
                  </label>
                  <input
                    type="text"
                    id="mname"
                    name="mname"
                    value={profileData.mname}
                    onChange={handleChange}
                    className="set"
                  />
                </div>
                <div className="form-input-set">
                  <label htmlFor="lname" className="set">
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="lname"
                    name="lname"
                    value={profileData.lname}
                    onChange={handleChange}
                    className="set"
                  />
                </div>
              </div>

              <div className="form-group-set">
                <div className="form-input-set">
                  <label htmlFor="email" className="set">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={profileData.email}
                    onChange={handleChange}
                    className="set"
                  />
                </div>
              </div>
              <div className="mt-5 text-center">
                <button
                  className="btn btn-primary profile-button-set"
                  type="submit"
                  disabled={!isProfileChanged}
                >
                  Save Profile
                </button>
              </div>
              {error.length > 0 && <p className="error-message">{error}</p>}
              {successMessage.length > 0 && (
                <p className="success-message">{successMessage}</p>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManagerProfileSettings;
