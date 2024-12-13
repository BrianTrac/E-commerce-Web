const express = require('express');
const router = express.Router();
const refreshTokenController = require('../../controllers/user/auth/refreshToken.controller');    

router.post('/', refreshTokenController.handleRefreshToken);

module.exports = router;    