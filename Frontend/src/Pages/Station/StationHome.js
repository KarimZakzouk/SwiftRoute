import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "../../styles.css";
import StarRatings from "react-star-ratings";

export default function Station() {
  const location = useLocation();
  const [Station, SetStation] = useState({
    station_name: "",
    street: "",
    zipcode: "",
    governorate: "",
    rate: null,
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(true);

  // assume station id is sent
  useEffect(() => {
    (async () => {
      try {
        const result = await fetch("http://localhost:6969/Passenger/Station", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ st_id: location.state.value }),
        });
        const resultInjson = await result.json();
        console.log(resultInjson);
        if (resultInjson.success) {
          SetStation(resultInjson.data); // Set rows based on the response's `data` field
          setLoading(false);
        } else {
          setErrorMessage("Failed to fetch data");
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setErrorMessage("Failed to fetch data");
        setLoading(false);
      }
    })();
  }, [location.state.value]);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (errorMessage) {
    return <div className="error-message">{errorMessage}</div>;
  }

  return (
    <div id="home-page-container" style={{position: "relative" ,minHeight: "74vh"}}>
      {loading ? (
        <div id="loading-container">
          <p id="loading-message">Loading...</p>
        </div>
      ) : (
        <div id="profile-container">
          <h1 id="profile-title">Station Profile</h1>

            <div id="location-station">
            <div id="station-name">
              <h3>Station: </h3>
              <p id="station-value">
                {Station.station_name
                  ? Station.station_name
                  : "No station available"}
              </p>
            </div>
              {Station.street && (
                <div id="station-street">
                  <h3>Street: </h3>
                  <p>
                    {Station.street ? Station.street : "No street information"}
                  </p>
                </div>
              )}
              {Station.zipcode && (
                <div id="station-zipcod">
                  <h3>Zipcode: </h3>
                  <p>
                    {Station.zipcode ? Station.zipcode : "No zipcode available"}
                  </p>
                </div>
              )}
              {Station.governorate && (
                <div id="station-governorate">
                  <h3>Governorate: </h3>
                  <p>
                    {Station.governorate
                      ? Station.governorate
                      : "No governorate information"}
                  </p>
                </div>
              )}
            </div>
            {Station && Station.rate !== null && (
              <div id="station-value">
                <h3>Average Rating: </h3>
                <div id="star-ratings-wrapper">
                  <StarRatings
                    rating={isNaN(Station.rate) ? 0 : parseFloat(Station.rate)}
                    starRatedColor="gold"
                    numberOfStars={5}
                    name="rating"
                    starDimension="30px"
                    starSpacing="5px"
                  />
                </div>
                <span id="average-rating-value">
                  {Station.rate && !isNaN(Station.rate)
                    ? parseFloat(Station.rate).toFixed(2)
                    : "No ratings yet"}
                </span>
              </div>
            )}
          </div>
      )}
    </div>
  );
}
