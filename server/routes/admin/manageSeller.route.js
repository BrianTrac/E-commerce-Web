const express = require('express');
const router = express.Router();
const manageSellerController = require('../../controllers/admin/manageSeller.controller');

router.get('/', manageSellerController.getAllSeller);

module.exports = router;