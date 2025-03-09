const pool = require("../models/db");

exports.orderPrivateTrip = async (req, res) => {
  const { Source, Destination, date, p_id, Price } = req.body;
  const query =
    'insert into "Private Trip" (source, destination, price, date, p_id) values($1, $2, $3, $4, $5)';
  try {
    await pool.query(query, [Source, Destination, Price, date, p_id]);
    res.json({
      success: true,
      message: "Your request is recorded successfully!",
    });
  } catch (error) {
    if (error.code == "23503") {
      res.json({
        success: false,
        message: "The inserted passenger doesn't exist in the system!",
        details: error.detail,
      });
    } else {
      console.error("Error connecting to the database:", error);
      res.status(500).json({
        success: false,
        message: "Database connection failed",
      });
    }
  }
};

const sendPassengerCountUpdate = (trip_id, res) => {
  pool.query(
    'SELECT count(*) FROM "Passenger Trip" WHERE "t_id" = $1',
    [trip_id],
    (err, result) => {
      if (err) {
        console.error("Error fetching passenger count:", err);
        return;
      }

      const passengerCount = result.rows[0].count;
      console.log("Passenger count:", passengerCount);
      res.write(
        `data: ${JSON.stringify({ trip_id, count: passengerCount })}\n\n`
      );
    }
  );
};

exports.requestTrip = async (req, res) => {
  const { p_id, t_id, rate } = req.body;
  console.log(req.body);

  const query1 =
    'select c.number_of_seats from "Car" c, "Driver" d, "Trip" t where c.d_ssn = d.ssn and d.ssn = t.d_ssn and t.trip_id = $1';
  const query2 = 'select count(*) from "Passenger Trip" where t_id = $1';
  const query3 = 'insert into "Passenger Trip" values($1, $2, false, $3)';

  try {
    const result1 = await pool.query(query1, [t_id]);
    if (result1.rows.length === 0) {
      return res.json({ success: false, message: "This trip is not found!" });
    }

    const number_of_seats = result1.rows[0].number_of_seats;
    const result2 = await pool.query(query2, [t_id]);

    if (parseInt(result2.rows[0].count) < number_of_seats) {
      await pool.query(query3, [p_id, t_id, rate]);

      // Set up SSE headers for streaming
      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");

      res.json({
        success: true,
        message: "The trip is requested successfully!",
      });

      console.log("Sending passenger count update");
      sendPassengerCountUpdate(t_id, res);

      // Optionally, you can keep sending updates periodically or when certain events occur
      const interval = setInterval(() => {
        sendPassengerCountUpdate(t_id, res);
      }, 10000); // Send updates every 10 seconds (you can adjust this)

      // Cleanup on connection close
      req.on("close", () => {
        console.log("Connection closed");
        clearInterval(interval);
      });
    } else {
      res.json({ success: false, message: "Sorry, the trip is full now!" });
    }
  } catch (error) {
    if (error.code == "23503") {
      res.json({
        success: false,
        message: "The inserted passenger or trip doesn't exist in the system!",
        details: error.detail,
      });
    } else {
      console.error("Error connecting to the database:", error);
      res.status(500).json({
        success: false,
        message: "Database connection failed",
      });
    }
  }
};
exports.sendPassengerCountUpdates = (req, res) => {
  const { trip_id } = req.query; // Get the trip_id from the query parameters
  console.log(req.body);
  if (!trip_id) {
    return res
      .status(400)
      .json({ success: false, message: "Trip ID is required" });
  }

  // Set the headers for SSE
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  console.log("Sending passenger count updates for trip:", trip_id);

  const sendUpdate = () => {
    pool.query(
      'SELECT count(*) FROM "Passenger Trip" WHERE "t_id" = $1',
      [trip_id],
      (err, result) => {
        if (err) {
          console.error("Error fetching passenger count:", err);
          return;
        }

        const passengerCount = result.rows[0].count;
        res.write(
          `data: ${JSON.stringify({ trip_id, count: passengerCount })}\n\n`
        );
      }
    );
  };

  // Send initial update
  sendUpdate();

  // Optionally, send updates at a regular interval (e.g., every 10 seconds)
  const interval = setInterval(sendUpdate, 10000);

  // Clean up when the connection is closed
  req.on("close", () => {
    console.log("Connection closed");
    clearInterval(interval); // Stop sending updates
  });
};

exports.getMyTrips = async (req, res) => {
  const p_id = req.body.p_id;
  console.log(req.body);
  const query =
    'select t_id, s.station_id as source_id, d.station_id as destination_id, s.station_name as source,d.station_name as destination, t.price, pt.is_favourite, pt.rate, d1.ssn as driver_ssn, d1.fname driver_fname, d1.mname, d1.lname from "Trip" t,"Passenger Trip" pt, "Driver" d1, "Station" s, "Station" d where t.trip_id = pt.t_id and s.station_id = t.source_station and d.station_id = t.destination_station and d1.ssn = t.d_ssn and pt.p_id = $1';
  try {
    const result = await pool.query(query, [p_id]);
    console.log(result.rows);
    res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error("Error connecting to the database:", error);
    res.status(500).json({
      success: false,
      message: "Database connection failed",
    });
  }
};

exports.getTrips = async (req, res) => {
  const accepted = "ongoing";
  const p_id = req.body.p_id;

  const query = `
    SELECT 
      d1.ssn AS driver_ssn, 
      d1.fname AS driver_fname, 
      d1.mname, 
      d1.lname, 
      s.station_id AS source_id, 
      s.station_name AS source, 
      s.street AS source_street, 
      s.governorate AS source_governorate, 
      d.station_id AS destination_id, 
      d.station_name AS destination, 
      d.street AS destination_street, 
      d.governorate AS destination_governorate, 
      t.trip_id, 
      t.price, 
      t.estimated_time, 
      c.number_of_seats,
      (SELECT COUNT(*) FROM "Passenger Trip" WHERE t_id = t.trip_id) AS passenger_count
    FROM 
      "Driver" d1
      JOIN "Trip" t ON d1.ssn = t.d_ssn
      JOIN "Station" s ON t.source_station = s.station_id
      JOIN "Station" d ON t.destination_station = d.station_id
      JOIN "Car" c ON d1.ssn = c.d_ssn
    WHERE 
      t.status = $1
      AND t.trip_id NOT IN (SELECT t_id FROM "Passenger Trip" WHERE p_id = $2)
  `;

  try {
    const result = await pool.query(query, [accepted, p_id]);
    const filteredTrips = result.rows.filter((trip) => {
      return trip.passenger_count < trip.number_of_seats;
    });

    res.json({ success: true, data: filteredTrips });
  } catch (error) {
    console.error("Error connecting to the database:", error);
    res.status(500).json({
      success: false,
      message: "Database connection failed",
    });
  }
};



exports.getStatusPrivateTrips = async (req, res) => {
  const p_id = req.body.p_id;
  console.log(p_id);
  const query =
    'select order_id, source, destination, d_ssn,estimated_time,date,price, fname as driver_fname from ("Private Trip" left join "Driver" on d_ssn = ssn) where  p_id = $1';
  try {
    const result = await pool.query(query, [p_id]);
    console.log(result.rows);
    res.json({ success: true, data: result.rows });
  } catch (error) {
    if (error.code == "23503") {
      res.json({
        success: false,
        message: "The inserted passenger doesn't exist in the system!",
        details: error.detail,
      });
    } else {
      console.error("Error connecting to the database:", error);
      res.status(500).json({
        success: false,
        message: "Database connection failed",
      });
    }
  }
};

exports.setFavouriteTrip = async (req, res) => {
  const { p_id, t_id, isFavourite } = req.body;
  const query =
    'update "Passenger Trip" set is_favourite = $1 where p_id = $2 and t_id = $3';
  try {
    await pool.query(query, [isFavourite, p_id, t_id]);
    res.json({ success: true, Message: "The operation is done successfully!" });
  } catch (error) {
    if (error.code == "23503") {
      res.json({
        success: false,
        message: "The passenger or the trip doesn't exist in the system!",
        details: error.detail,
      });
    } else {
      console.error("Error connecting to the database:", error);
      res.status(500).json({
        success: false,
        message: "Database connection failed",
      });
    }
  }
};

exports.removePrivateTrip = async (req, res) => {
  const { order_id, p_id } = req.body;
  console.log(req.body);
  const query = 'delete from "Private Trip" where order_id = $1 and p_id = $2';
  try {
    const result = await pool.query(query, [order_id, p_id]);
    console.log(result.rowCount);
    if (result.rowCount == 0) {
      res.json({ success: true, removed: false });
    } else {
      res.json({ success: true, removed: true });
    }
  } catch (error) {
    if (error.code == "23503") {
      res.json({
        success: false,
        message:
          "The passenger or the private trip doesn't exist in the system!",
        details: error.detail,
      });
    } else {
      console.error("Error connecting to the database:", error);
      res.status(500).json({
        success: false,
        message: "Database connection failed",
      });
    }
  }
};

exports.station = async (req, res) => {
  const st_id = req.body.st_id;
  const query =
    'select station_name, street, zipcode, governorate from "Station" where station_id = $1';
  try {
    const result = await pool.query(query, [st_id]);
    res.json({
      success: true,
      data: {
        station_name: result.rows[0].station_name,
        street: result.rows[0].street,
        zipcode: result.rows[0].zipcode,
        governorate: result.rows[0].governorate,
        rate: result.rows[0].rate,
      },
    });
  } catch (error) {
    console.error("Error connecting to the database:", error);
    res.status(500).json({
      success: false,
      message: "Database connection failed",
    });
  }
};
