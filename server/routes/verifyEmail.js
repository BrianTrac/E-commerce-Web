const express = require('express');
const router = express.Router();
const emailVerificationController = require('../controllers/emailVerificationController');

router.post('/', emailVerificationController.verifyEmail);

module.exports = router;