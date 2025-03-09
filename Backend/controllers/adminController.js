const pool = require('../models/db')
const bcrypt = require('bcrypt');

exports.verify = async (req, res) => {
  const ssn = req.body.ssn;
  const m_ssn = req.body.m_ssn;
  const query = 'update "Manager" set verified_by = $1 where ssn = $2';
  try {
    await pool.query(query, [ssn, m_ssn]);
    res.json({ success: true });
  }
  catch (err) {
    res.json({ success: false });
  }
};

exports.reject = async (req, res) => {
  const ssn = req.body.ssn;
  const m_ssn = req.body.m_ssn;
  const query = 'delete from "Manager" where ssn = $1';
  try {
    await pool.query(query, [m_ssn]);
    res.json({ success: true });
  }
  catch (err) {
    res.json({ success: false });
  }
};

exports.addStation = async (req, res) => {
  const { station_name, street, zipcode, governorate, m_ssn } = req.body;
  const query = 'insert into "Station" ("station_name", "street", "zipcode", "governorate") values($1,$2,$3,$4)';
  console.log(req.body);
  try {
    await pool.query(query, [station_name, street, zipcode, governorate]);
    res.json({ success: true });
  }
  catch (err) {
    if (err.code === "23505") {
      res.json({
        success: false,
        message: "Duplicate entry detected",
        details: error.detail,
      });
    } else {
      res.status(500).json({
        success: false,
        message: "Database error occurred",
      });
    }
    console.log(err);
  }
};

exports.removeStation = async (req, res) => {
  const station_ids = req.body.stationIds; 

  const query = `DELETE FROM "Station" WHERE station_id = $1`;

  try {
    for (const id of station_ids) {
      await pool.query(query, [id]);
    }

    res.json({ success: true, message: "Stations deleted successfully." });
  } catch (err) {
    console.error("Error deleting stations:", err);
    res.status(500).json({ success: false, message: "An error occurred while deleting stations." });
  }
};

exports.getStations = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM "Station"');
    res.json({
      data: result.rows,
      success: true,
    });
  } catch (error) {
    console.error("Error connecting to the database:", error);
    res.status(500).json({
      success: false,
      message: "Database connection failed",
    });
  }
};

exports.getUnverifiedManagers = async (req, res) => {
  try
  {
     const query = 'SELECT ssn,fname,mname,lname FROM "Manager" WHERE verified_by is null';
     const result = await pool.query(query);
     res.json({
        data : result.rows,
        success : true
     });
  }
  catch(error)
  {
    console.error("Error connecting to the database:", error);
    res.status(500).json({
      success: false,
      message: "Database connection failed",
    });
  }
}

exports.getStationWithoutManager = async (req, res) => {
  try
  {
     const query = 'SELECT station_id, station_name FROM "Station" WHERE "m_ssn" is null';
     const result = await pool.query(query);
     res.json({
        data : result.rows,
        success : true
     });
  }
  catch(error)
  {
    console.error("Error connecting to the database:", error);
    res.status(500).json({
      success: false,
      message: "Database connection failed",
    });
  }
}

exports.createManagers = async (req, res) => {
  const { ssn, fname, mname, lname, email, password, station_id } = req.body;
  const query = 'insert into "Manager" ("ssn", "fname", "mname", "lname", "email", "zipcode", "governorate", "station_id") values($1,$2,$3,$4,$5,$6,$7,$8)';
  try {
    await pool.query(query, [ssn, fname, mname, lname, street, zipcode, governorate, station_id]);
    res.json({ success: true });
  }
  catch (err) {
    if (err.code === "23505") {
      res.json({
        success: false,
        message: "Duplicate entry detected",
        details: error.detail,
      });
    } else {
      res.status(500).json({
        success: false,
        message: "Database error occurred",
      });
    }
    console.log(err);
  }
}
exports.registerManagerWithStation = async (req, res) => {
  const { fname, mname, lname, m_ssn, email, password, station_id } = req.body;
  const saltRounds = 10;

  const ssn = m_ssn;

  try {
    // Validate input
    if (isNaN(ssn) || ssn.trim() === "") {
      return res
        .status(400)
        .json({ success: false, message: "SSN must be a valid number." });
    }

    if (!station_id || station_id.trim() === "") {
      return res
        .status(400)
        .json({ success: false, message: "Station ID is required." });
    }

    // Check if the email already exists in any user table
    const emailCheck = await pool.query(
      `
      SELECT email FROM "Passenger" WHERE email = $1
      UNION
      SELECT email FROM "Admin" WHERE email = $1
      UNION
      SELECT email FROM "Manager" WHERE email = $1
      UNION
      SELECT email FROM "Driver" WHERE email = $1
    `,
      [email]
    );

    if (emailCheck.rows.length > 0) {
      return res
        .status(400)
        .json({ success: false, message: "Email already exists" });
    }

    // Check if the SSN already exists in any user table
    const ssnCheck = await pool.query(
      `
      SELECT ssn FROM "Admin" WHERE ssn = $1
      UNION
      SELECT ssn FROM "Manager" WHERE ssn = $1
      UNION
      SELECT ssn FROM "Driver" WHERE ssn = $1
    `,
      [ssn]
    );

    if (ssnCheck.rows.length > 0) {
      return res
        .status(400)
        .json({ success: false, message: "SSN already exists" });
    }

    // Verify if the station ID exists
    const stationCheck = await pool.query(
      'SELECT station_id FROM "Station" WHERE station_id = $1',
      [station_id]
    );

    if (stationCheck.rows.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Station ID does not exist" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insert the manager into the database
    await pool.query(
      'INSERT INTO "Manager" (ssn, email, fname, mname, lname, password) VALUES ($1, $2, $3, $4, $5, $6)',
      [ssn, email, fname, mname, lname, hashedPassword]
    );

    await pool.query(
      'UPDATE "Station" SET m_ssn = $1 WHERE station_id = $2',
      [ssn, station_id]
    );

    res.json({
      success: true,
      message: "Manager registered successfully",
    });
  } catch (error) {
    console.error("Error connecting to the database:", error);

    if (error.code === "23505") {
      res.status(400).json({
        success: false,
        message: "Duplicate entry detected",
        details: error.detail,
      });
    } else {
      res.status(500).json({
        success: false,
        message: "Database error occurred",
      });
    }
  }
};



