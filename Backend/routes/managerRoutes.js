const express = require("express");
const router = express.Router();
const managerController = require("../controllers/managerController");

//Gets all stations in the Database
router.post("/stations", managerController.getStations);

//Gets all stations in the Database
router.post("/trips", managerController.getTrips);

//Create trips using { mssn (Manager SSN), price, date, dssn (Driver SSN), estimatedtime, destinationStation (ID of Destination Station)}
router.post("/create-trips", managerController.createTrip);

//Gets all the drivers for the manager using { mssn (Manager ssn) }
router.post("/drivers", managerController.getDrivers);

//Gets all Private Trips in the Database
router.get("/private-trips", managerController.getPrivateTrips);

//Fire a Driver using { mssn (Manager ssn), dssn }
router.post("/fire", managerController.fireDriver);

//Hire a Driver using { mssn (Manager ssn), dssn, shift, salary }
router.post("/hire", managerController.hireDriver);

//Update a salary of a Driver using { mssn, dssn, newSalary }
router.post("/update-salary", managerController.updateDriverSalary);

// get avaible drivers
router.post("/available-drivers", managerController.getAvailableDrivers);

// Update Price
router.post("/update-price", managerController.updateTripPrice);

// Update Destination
router.post("/update-destination", managerController.updateTripDestination);

// Set Driver for a trip
router.post("/set-trip-driver", managerController.updateTripDriver);

router.post("/check-verified", managerController.checkManagerVerified);

router.post("/manager-finance", managerController.getManagerFinanace);


router.post("/manager-add-salary", managerController.addManagerFinancesSalary);

router.post("/requests", managerController.requests);

router.post("/respond-request", managerController.respondRequest);

router.post("/profile", managerController.profile);

router.put("/profile", managerController.updateProfile);    

router.post("/rate", managerController.getTotalRate);

router.post("/getLostStatus", managerController.getLostStatus);

router.post("/getResignedDrivers", managerController.getResignedDrivers);


// 

module.exports = router;
