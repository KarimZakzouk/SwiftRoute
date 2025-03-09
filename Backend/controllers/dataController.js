const pool = require("../models/db");

exports.getData = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM learn");
    res.json({
      data: result.rows,
    });
  } catch (error) {
    console.error("Error connecting to the database:", error);
    res.status(500).json({
      success: false,
      message: "Database connection failed",
    });
  }
};

exports.postData = (req, res) => {
  const receivedData = req.body;
  console.log("Data received from frontend:", receivedData.text);

  res.json({
    success: true,
    message: "Data received successfully!",
    receivedData,
  });
};
