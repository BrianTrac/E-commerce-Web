const express = require('express');
const router = express.Router();
const otpVerificationController = require('../controllers/otpVerificationController');

router.post('/', otpVerificationController.verifyOTP);

module.exports = router;