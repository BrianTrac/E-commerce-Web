const express = require('express');
const router = express.Router();
const resetPasswordController = require('../../controllers/user/auth/resetPassword.controller');

router.post('/', resetPasswordController.resetPassword);

module.exports = router;
