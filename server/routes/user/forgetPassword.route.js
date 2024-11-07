const express = require('express');
const router = express.Router();
const forgetPasswordController = require('../../controllers/user/auth/forgetPassword.controller');

router.post('/', forgetPasswordController.sendResetLink);

module.exports = router;