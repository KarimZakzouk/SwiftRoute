const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/signup', authController.register);
router.post('/login', authController.login);
router.post('/change-password', authController.changePassword);
router.post('/delete-account', authController.deleteAccount);
router.post('/profile', authController.profile);
router.put('/profile', authController.updateProfile);



module.exports = router;
