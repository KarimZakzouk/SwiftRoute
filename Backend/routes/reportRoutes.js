const express = require("express");
const router = express.Router();
const reportController = require("../controllers/reportController");

router.get("/most-source-station", reportController.getMostSourceStationReport);

router.get("/most-destination-station", reportController.getMostDestinationStationReport);

//router.get("/trip-report", reportController.getTripReport);
//router.get("/stations-count", reportController.stationsCount);

router.get("/most-lost-items", reportController.mostLostItemsInTrips);
router.get("/avg-trip-duration", reportController.getAverageTripDuration);
router.get("/avg-trip-cost", reportController.getAverageTripCost);
router.get("/user-counts", reportController.getUserCounts);

router.get("/passenger-average-age", reportController.getAverageAgePassenger);


router.get("/trips-per-station", reportController.getTripsMonthStation);
router.get("/manager-finances", reportController.getManagerFinance);
router.get("/station-rate", reportController.getStationsRating);
router.get("/driver-trips-not-private", reportController.getTripsCountDriverNotPrivatePerMonth);
router.get("/driver-trips-private", reportController.getTripsCountDriverPrivatePerMonth);
router.get("/passenger-average-trips", reportController.getAveragePassangersTripPerMonth);
router.get("/passenger-trips", reportController.getPassengerTripsPerMonth);
router.get("/average-station-salary", reportController.getAverageStationSalary);
router.get("/count_all",reportController.count_all);
router.get("/managers_per_location",reportController.managers_per_location);
router.get("/drivers_per_location",reportController.drivers_per_location);
router.get("/passenger-expence",reportController.getPassengerExpence);

router.get("/driver-details",reportController.getDriverDetails);

router.get("/passenger-details",reportController.getPassengerDetails);

router.get("/manager-details",reportController.getManagerDetails);

module.exports = router;
