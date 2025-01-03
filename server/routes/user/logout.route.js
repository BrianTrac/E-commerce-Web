const express = require('express');
const router = express.Router();
const logoutController = require('../../controllers/user/auth/logout.controller');

router.post('/', logoutController.handleLogout);

module.exports = router;