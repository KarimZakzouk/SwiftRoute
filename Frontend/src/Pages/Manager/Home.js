import React, { useState, useEffect } from "react";
import StarRatings from "react-star-ratings";
import "./Manager.css";

export default function Manager() {
  const [isVerified, setIsVerified] = useState(false);
  const [managerProfile, setManagerProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const userssn = sessionStorage.getItem("ssn");

  useEffect(() => {
    const fetchManagerProfile = async () => {
      try {
        const response = await fetch("http://localhost:6969/manager/profile", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ssn: userssn }),
        });

        const data = await response.json();
console.log(data);
        if (data.success) {
          setManagerProfile(data);
          setIsVerified(data.data.verified_by ? true : false);
        } else {
          setManagerProfile(null);
          setIsVerified(false);
        }
      } catch (error) {
        console.error("Error fetching manager profile:", error);
        setManagerProfile(null);
        setIsVerified(false);
      } finally {
        setLoading(false);
      }
    };

    fetchManagerProfile();
  }, [userssn]);

  return (
    <div id="home-page-container">
      {loading ? (
        <div id="loading-container">
          <p id="loading-message">Loading...</p>
        </div>
      ) : (
        <div id="profile-container">
          <h1 id="manager-greeting">
            Welcome back,{" "}
            {managerProfile
              ? `${managerProfile.data.fname} ${managerProfile.data.lname}`
              : "User"}
          </h1>

          <div id="verification-status">
            {managerProfile && !isVerified && (
              <p id="verification-status-not-verified">
                You are not verified yet. Please wait for admin verification.
              </p>
            )}

            {managerProfile && isVerified && (
              <p id="verification-status-verified">
                Your account has been verified by{" "}
                {managerProfile.admin || "an admin"}.
              </p>
            )}
          </div>

          <div id="profile-info">
            <div id="station-info">
              <h3>Station: </h3>
              <p id="station-value">
                {managerProfile
                  ? managerProfile.station
                  : "No station available"}
              </p>
            </div>

            <div id="trips-source">
              <h3>Trips As Source: </h3>
              <p id="trips-source-value">
                {managerProfile ? managerProfile.tripsAsSource : "0"}
              </p>
            </div>

            <div id="trips-destination">
              <h3>Trips As Destination: </h3>
              <p id="trips-destination-value">
                {managerProfile ? managerProfile.tripsAsDestination : "0"}
              </p>
            </div>

            {managerProfile && managerProfile.averageRate !== null && (
              <div id="rating-info">
                <h3>Average Rating: </h3>
                <div id="star-ratings-wrapper">
                  <StarRatings
                    rating={
                      isNaN(managerProfile.averageRate)
                        ? 0
                        : parseFloat(managerProfile.averageRate)
                    }
                    starRatedColor="gold"
                    numberOfStars={5}
                    name="rating"
                    starDimension="30px"
                    starSpacing="5px"
                  />
                </div>
                <span id="average-rating-value">
                  {managerProfile.averageRate &&
                  !isNaN(managerProfile.averageRate)
                    ? parseFloat(managerProfile.averageRate).toFixed(2)
                    : "No ratings yet"}
                </span>
              </div>
            )}
          </div>

          <div id="footer">
            <p>&copy; 2024, My Manager Dashboard</p>
          </div>
        </div>
      )}
    </div>
  );
}
