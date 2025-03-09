const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

router.post('/verify',adminController.verify);
router.post('/reject',adminController.reject);
router.post('/addStation',adminController.addStation);
router.post('/removeStation',adminController.removeStation);
router.get('/getStations',adminController.getStations);
router.get('/getUnverifiedManagers',adminController.getUnverifiedManagers);
router.post('/hireManager',adminController.registerManagerWithStation );
router.post('/stations_with_no_managers',adminController.getStationWithoutManager);

module.exports = router;