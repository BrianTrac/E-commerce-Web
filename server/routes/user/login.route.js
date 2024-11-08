const express = require('express');
const router = express.Router();
const loginController = require('../../controllers/user/auth/login.controller');

router.post('/', loginController.handleLogin);

module.exports = router;