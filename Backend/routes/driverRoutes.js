const express = require("express");
const router = express.Router();
const driverController = require("../controllers/driverController");

// Set estimated time for a trip using { d_ssn (Driver SSN), trip_id, estimated_time }
router.post("/set-estimated-time", driverController.setEstimatedTime);

// Request a change to an assigned trip using { d_ssn (Driver SSN), trip_id, reason }
router.post("/accept-trip", driverController.acceptTrips);

// Mark attendance for a shift using { d_ssn (Driver SSN), shift_date, status }
router.post("/mark-attendance", driverController.markAttendance);

// Get all trips assigned to a driver using { d_ssn (Driver SSN) }
router.post("/get-trips", driverController.getTrips);

// Get number of passengers for a trip using { trip_id }
router.post("/get-passengers-number", driverController.getNumberofPassengers);

// Start a trip using { trip_id }
router.post("/ongoing-trip", driverController.ongoingAcceptedTrips);

router.post("/start-trip", driverController.startAcceptedTrips);

// Reject a trip request using { trip_id }
router.post("/reject-trip", driverController.rejectTrip);

// Get attendance for a driver using { d_ssn (Driver SSN)}
router.post("/get-attendance", driverController.getAttendance);

// Accept or reject a private trip request using { d_ssn (Driver SSN), private_trip_id, action ('accept' or 'reject') }
router.post("/accept-reject-private-trip", driverController.acceptRejectPrivateTrip);

// Get all private trips assigned to a driver using { d_ssn (Driver SSN) }
router.post("/get-private-trips", driverController.getPrivateTrips);

router.post("/get-private-status", driverController.getPrivateStatus);
// Request a day off using { d_ssn (Driver SSN), date, reason }
router.post("/request-day-off", driverController.requestDayOff);

// Get all day off requests for a driver using { d_ssn (Driver SSN) }
router.post("/get-day-off-requests", driverController.getDayOffRequests);

// Report a lost item during a trip using { d_ssn (Driver SSN), trip_id, item_description }
router.post("/report-lost-item", driverController.reportLostItem);

// Driver resignation with { d_ssn (Driver SSN), reason, effective_date }
router.post("/resign", driverController.resignDriver);

router.post("/profile", driverController.profile);

router.put("/profile", driverController.updateProfile);

router.post("/rate", driverController.getRate );

router.post("/get-started-trips", driverController.getStartedTrips);

router.post("/rejectPrivateTrip", driverController.rejectPrivateTrip);

module.exports = router;
