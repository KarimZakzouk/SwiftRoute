const pool = require("../models/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  const {
    fname,
    mname,
    lname,
    job,
    ssn,
    email,
    password,
    age,
    carDetails,
    stationDetails,
  } = req.body;
  const saltRounds = 10;

  try {
    if (job !== "Passenger" && (isNaN(ssn) || ssn.trim() === "")) {
      return res
        .status(400)
        .json({ success: false, message: "SSN must be a valid number." });
    }

    if (job === "Passenger" && (isNaN(age) || age.trim() === "")) {
      return res
        .status(400)
        .json({ success: false, message: "Age must be a valid number." });
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);

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

    if (job !== "Passenger") {
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
    }

    let result;
    switch (job) {
      case "Admin":
        result = await pool.query(
          'INSERT INTO "Admin" (ssn, email, fname, mname, lname, password) VALUES ($1, $2, $3, $4, $5, $6)',
          [ssn, email, fname, mname, lname, hashedPassword]
        );
        break;
      case "Manager":
        result = await pool.query(
          'INSERT INTO "Manager" (ssn, email, fname, mname, lname, password, verified_by) VALUES ($1, $2, $3, $4, $5, $6, NULL)',
          [ssn, email, fname, mname, lname, hashedPassword]
        );

        if (stationDetails) {
          await pool.query(
            'INSERT INTO "Station" (station_name, street, zipcode, governorate, m_ssn ) VALUES ($1, $2, $3, $4, $5)',
            [
              stationDetails.station_name,
              stationDetails.street,
              stationDetails.zipcode,
              stationDetails.governorate,
              ssn,
            ]
          );
        }
        break;
        case "Driver":
          // Check if the car license already exists
          const carLicenseCheck = await pool.query(
            'SELECT car_license FROM "Car" WHERE car_license = $1',
            [carDetails.car_license]
          );
        
          if (carLicenseCheck.rows.length > 0) {
            return res.status(400).json({
              success: false,
              message: "Car license already exists",
            });
          }
        
          result = await pool.query(
            'INSERT INTO "Driver" (ssn, email, fname, mname, lname, password, is_private) VALUES ($1, $2, $3, $4, $5, $6, false)',
            [ssn, email, fname, mname, lname, hashedPassword]
          );
        
          if (carDetails) {
            await pool.query(
              'INSERT INTO "Car" (car_license, number_of_seats, air_conditioning, car_type, additional_price, d_ssn) VALUES ($1, $2, $3, $4, $5, $6)',
              [
                carDetails.car_license,
                carDetails.number_of_seats,
                carDetails.air_conditioning,
                carDetails.car_type,
                carDetails.additional_price,
                ssn,
              ]
            );
          }
          break;
      case "Passenger":
        result = await pool.query(
          'INSERT INTO "Passenger" (email, age, fname, lname, password) VALUES ($1, $2, $3, $4, $5)',
          [email, age, fname, lname, hashedPassword]
        );
        break;
      default:
        return res
          .status(400)
          .json({ success: false, message: "Invalid job type" });
    }

    res.json({ Register: true, success: true });
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

exports.login = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  let ssn;
  let verifiedBy = null; // Variable to hold verified_by for Manager
  let userType;
  let userProfile = {}; // Object to hold profile information
  
  try {
    // Query for Admin user
    const result1 = await pool.query(
      'SELECT ssn, email, password, fname, mname, lname FROM "Admin" WHERE email = $1',
      [email]
    );

    // Query for Manager user
    const result2 = await pool.query(
      'SELECT ssn, email, password, fname, mname, lname, verified_by FROM "Manager" WHERE email = $1',
      [email]
    );

    // Query for Driver user
    const result3 = await pool.query(
      'SELECT ssn, email, password, fname, mname, lname, is_private, shift, salary, s_id, m_ssn FROM "Driver" WHERE email = $1',
      [email]
    );

    // Query for Passenger user
    const result4 = await pool.query(
      'SELECT id, email, password, fname, lname FROM "Passenger" WHERE email = $1',
      [email]
    );

    let user = null;

    // Check which user type the email corresponds to
    if (result1.rows.length === 1) {
      user = result1.rows[0];
      ssn = user.ssn;
      userType = "Admin";
      userProfile = user; // Store admin profile data
    } else if (result2.rows.length === 1) {
      user = result2.rows[0];
      ssn = user.ssn;
      verifiedBy = user.verified_by; // Store the verified_by value for Manager
      userType = "Manager";
      userProfile = user; // Store manager profile data
    } else if (result3.rows.length === 1) {
      user = result3.rows[0];
      ssn = user.ssn;
      userType = "Driver";
      userProfile = user; // Store driver profile data
    } else if (result4.rows.length === 1) {
      user = result4.rows[0];
      ssn = user.id;
      userType = "Passenger";
      userProfile = user; // Store passenger profile data
    }

    if (!user) {
      console.log("Login Failed, Wrong Email");
      return res.json({ login: false, success: true });
    }

    // Check if the password matches
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (passwordMatch) {
      // Generate JWT token
      const token = jwt.sign(
        { ssn: ssn, userType: userType },
        "your_secret_key",
        { expiresIn: "1h" }
      );
      console.log("Login Successful");

      // Prepare the response with user profile and token
      const response = {
        login: true,
        success: true,
        token: token,
        type: userType,
        ssn: ssn,
        fname: userProfile.fname,
        mname: userProfile.mname,
        lname: userProfile.lname,
        email: userProfile.email,
        is_private: userProfile.is_private,
        shift: userProfile.shift,
        salary: userProfile.salary,
        s_id: userProfile.s_id,
        m_ssn: userProfile.m_ssn,
      };

      // Include verified_by for Manager
      if (userType === "Manager") {
        response.verified_by = verifiedBy;
      }

      res.json(response);
    } else {
      res.json({ login: false, success: true });
    }
  } catch (error) {
    console.error("Error connecting to the database:", error);
    res.status(500).json({
      success: false,
      message: "Database connection failed",
    });
  }
};

exports.changePassword = async (req, res) => {
  const { ssn, oldPassword, password, confirmPassword } = req.body;
  console.log(req.body);

  try {
    if (!oldPassword || !password || !confirmPassword) {
      return res
        .status(400)
        .json({ success: false, message: "Please enter all required fields" });
    }

    const userQuery = `
      SELECT "ssn", "email", "password" FROM "Admin" WHERE ssn = $1
      UNION
      SELECT "ssn", email, "password" FROM "Manager" WHERE ssn = $1
      UNION
      SELECT "ssn", email, "password" FROM "Driver" WHERE ssn = $1
      UNION
      SELECT "id" AS ssn, email, "password" FROM "Passenger" WHERE id = $1
    `;
    const result = await pool.query(userQuery, [ssn]);

    if (result.rows.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }

    const user = result.rows[0];

    const passwordMatch = await bcrypt.compare(oldPassword, user.password);
    if (!passwordMatch) {
      console.log("Current password is incorrect");
      return res
        .status(400)
        .json({ success: false, message: "Current password is incorrect" });
    }

    if (password !== confirmPassword) {
      return res
        .status(400)
        .json({ success: false, message: "Passwords do not match" });
    }

    if (password === oldPassword) {
      return res
        .status(400)
        .json({ success: false, message: "Password didn't change" });
    }

    const saltRounds = 10;
    const hashedNewPassword = await bcrypt.hash(password, saltRounds);

    const updateQueries = [
      `UPDATE "Admin" SET password = $1 WHERE ssn = $2`,
      `UPDATE "Manager" SET password = $1 WHERE ssn = $2`,
      `UPDATE "Driver" SET password = $1 WHERE ssn = $2`,
      `UPDATE "Passenger" SET password = $1 WHERE id = $2`,
    ];

    for (const query of updateQueries) {
      await pool.query(query, [hashedNewPassword, ssn]);
    }

    res.json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    console.error("Error updating password:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while updating the password",
    });
  }
};

exports.deleteAccount = async (req, res) => {
  const { ssn } = req.body;
  console.log(req.body);

  try {
    const deleteQueries = [
      `DELETE FROM "Admin" WHERE ssn = $1`,
      `DELETE FROM "Manager" WHERE ssn = $1`,
      `DELETE FROM "Driver" WHERE ssn = $1`,
      `DELETE FROM "Passenger" WHERE id = $1`,
    ];

    for (const query of deleteQueries) {
      await pool.query(query, [ssn]);
    }

    res.json({ success: true, message: "Account deleted successfully" });
  } catch (error) {
    console.error("Error deleting account:", error);
    res.status(500).json({
      success: false,
      message: "Database error occurred while deleting account",
    });
  }
};

exports.updateProfile = async (req, res) => {
  const { ssn, jobRole } = req.body;

  const { fname, mname, lname, email, is_private } = req.body.data;
  console.log(req.body);

  try {
    if (!["Driver", "Manager", "Admin", "Passenger"].includes(jobRole)) {
      return res.status(400).json({
        success: false,
        message: "Invalid job role provided.",
      });
    }

    const emailCheckQuery = `
        SELECT "email", "ssn" FROM "Driver" WHERE "email" = $1
        UNION
        SELECT "email", "ssn" FROM "Manager" WHERE "email" = $1
        UNION
        SELECT "email", "ssn" FROM "Admin" WHERE "email" = $1
        UNION
        SELECT "email", "id" AS "ssn" FROM "Passenger" WHERE "email" = $1
      `;

    const emailCheckResult = await pool.query(emailCheckQuery, [email]);
    const currentUser = emailCheckResult.rows[0];

    if (emailCheckResult.rows.length > 0)
    if (email == currentUser.email && ssn == currentUser.ssn) {
      return res.json({
        success: false,
        message: "Please enter a different Email",
      });
    }
    
    
    if (emailCheckResult.rows.length > 0) {
      const existingUser = emailCheckResult.rows[0];
      if (existingUser.ssn !== ssn) {
        return res.status(400).json({
          success: false,
          message: "Email is already in use by another user.",
        });
      }
    }
    
    let tableName = "";
    let updateFields = [];
    let updateValues = [];

    if (jobRole === "Driver") {
      const driverResult = await pool.query(
        'SELECT * FROM "Driver" WHERE "ssn" = $1',
        [ssn]
      );

      if (driverResult.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Driver not found.",
        });
      }

      if (fname) {
        updateFields.push('"fname" = $' + (updateValues.length + 1));
        updateValues.push(fname);
      }
      if (mname) {
        updateFields.push('"mname" = $' + (updateValues.length + 1));
        updateValues.push(mname);
      }
      if (lname) {
        updateFields.push('"lname" = $' + (updateValues.length + 1));
        updateValues.push(lname);
      }
      if (email) {
        updateFields.push('"email" = $' + (updateValues.length + 1));
        updateValues.push(email);
      }
      if (is_private !== driverResult.rows[0].is_private) {
        updateFields.push('"is_private" = $' + (updateValues.length + 1));
        updateValues.push(is_private);
      }

      tableName = "Driver";
    } else if (jobRole === "Manager") {
      const managerResult = await pool.query(
        'SELECT * FROM "Manager" WHERE "ssn" = $1',
        [ssn]
      );

      if (managerResult.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Manager not found.",
        });
      }

      if (fname) {
        updateFields.push('"fname" = $' + (updateValues.length + 1));
        updateValues.push(fname);
      }
      if (mname) {
        updateFields.push('"mname" = $' + (updateValues.length + 1));
        updateValues.push(mname);
      }
      if (lname) {
        updateFields.push('"lname" = $' + (updateValues.length + 1));
        updateValues.push(lname);
      }
      if (email) {
        updateFields.push('"email" = $' + (updateValues.length + 1));
        updateValues.push(email);
      }

      tableName = "Manager";
    } else if (jobRole === "Admin") {
      const adminResult = await pool.query(
        'SELECT * FROM "Admin" WHERE "ssn" = $1',
        [ssn]
      );

      if (adminResult.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Admin not found.",
        });
      }

      if (fname) {
        updateFields.push('"fname" = $' + (updateValues.length + 1));
        updateValues.push(fname);
      }
      if (mname) {
        updateFields.push('"mname" = $' + (updateValues.length + 1));
        updateValues.push(mname);
      }
      if (lname) {
        updateFields.push('"lname" = $' + (updateValues.length + 1));
        updateValues.push(lname);
      }
      if (email) {
        updateFields.push('"email" = $' + (updateValues.length + 1));
        updateValues.push(email);
      }

      tableName = "Admin";
    } else if (jobRole === "Passenger") {
      const passengerResult = await pool.query(
        'SELECT * FROM "Passenger" WHERE "id" = $1',
        [ssn]
      );

      if (passengerResult.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Passenger not found.",
        });
      }

      if (fname) {
        updateFields.push('"fname" = $' + (updateValues.length + 1));
        updateValues.push(fname);
      }
      if (lname) {
        updateFields.push('"lname" = $' + (updateValues.length + 1));
        updateValues.push(lname);
      }
      if (email) {
        updateFields.push('"email" = $' + (updateValues.length + 1));
        updateValues.push(email);
      }

      tableName = "Passenger";
    }

    console.log(updateFields, updateValues);

    if (updateFields.length > 0) {
      let updateQuery = 'UPDATE "' + tableName + '" SET ' + updateFields.join(", ") + ' WHERE ';
      
      if (jobRole === "Passenger") {
        updateQuery += '"id" = $' + (updateValues.length + 1);
      } else {
        updateQuery += '"ssn" = $' + (updateValues.length + 1);
      }
      
      await pool.query(updateQuery, [...updateValues, ssn]);
    }

      return res.json({
        success: true,
        message: `${jobRole} profile updated successfully!`,
      });
    res.status(400).json({
      success: false,
      message: "No valid fields provided to update.",
    });
  } catch (error) {
    console.error("Error updating user profile:", error);
    res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};

exports.profile = async (req, res) => {
  const { ssn, jobRole } = req.body;

  console.log(req.body);

  try {
    let userResult;
    let responseData = { success: false };

    if (jobRole === "Driver") {
      userResult = await pool.query(
        'SELECT "ssn", "email", "fname", "mname", "lname", "is_private", "m_ssn", "shift", "salary", "s_id" FROM "Driver" WHERE "ssn" = $1',
        [ssn]
      );
    } else if (jobRole === "Manager") {
      userResult = await pool.query(
        'SELECT "ssn", "email", "fname", "mname", "lname" FROM "Manager" WHERE "ssn" = $1',
        [ssn]
      );
    } else if (jobRole === "Admin") {
      userResult = await pool.query(
        'SELECT "ssn", "email", "fname", "mname", "lname" FROM "Admin" WHERE "ssn" = $1',
        [ssn]
      );
    } else if (jobRole === "Passenger") {
      userResult = await pool.query(
        'SELECT "id", "email", "fname", "lname" FROM "Passenger" WHERE "id" = $1',
        [ssn]
      );
    }

    if (userResult && userResult.rows.length > 0) {
      const user = userResult.rows[0];

      responseData.success = true;
      responseData.data = user;

      if (jobRole === "Driver") {
        if (user.m_ssn) {
          const managerResult = await pool.query(
            'SELECT "fname", "mname", "lname" FROM "Manager" WHERE "ssn" = $1',
            [user.m_ssn]
          );
          if (managerResult.rows.length > 0) {
            responseData.data.manager_name = `${managerResult.rows[0].fname} ${managerResult.rows[0].lname}`;
          }
          else{
            responseData.data.manager_name = "";
          }
        }

        if (user.s_id) {
          const stationResult = await pool.query(
            'SELECT "station_name" FROM "Station" WHERE "station_id" = $1',
            [user.s_id]
          );
          if (stationResult.rows.length > 0) {
            responseData.data.station_name = stationResult.rows[0].station_name;
          }
        }
        else{
          responseData.data.station_name="";
          responseData.data.manager_name="";
        }
    

        const tripResult = await pool.query(
          'SELECT AVG(rate) AS average_rate FROM "Trip", "Passenger Trip" WHERE "trip_id" = "t_id" AND "d_ssn" = $1',
          [ssn]
        );

        if (tripResult.rows.length > 0) {
          responseData.data.rate = tripResult.rows[0].average_rate;
        }
      }

      console.log(responseData);
      return res.json(responseData);
    }
    res.status(404).json({
      success: false,
      message: "User not found.",
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};
