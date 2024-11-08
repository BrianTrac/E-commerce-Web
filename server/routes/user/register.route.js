const express = require('express');
const router = express.Router();
const registerController = require('../../controllers/user/auth/register.controller');

router.post('/', registerController.handleRegister);
router.post('/verify-otp', registerController.verifyRegistrationOTP);
router.post('/resend-otp', registerController.resendOTP);

module.exports = router;