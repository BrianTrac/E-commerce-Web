const express = require('express');
const router = express.Router();
const forgetPasswordController = require('../controllers/forgetPasswordController');

router.post('/', forgetPasswordController.sendResetLink);

module.exports = router;