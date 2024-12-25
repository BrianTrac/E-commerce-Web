const express = require('express');
const router = express.Router();
const manageSellerController = require('../../controllers/admin/manageSeller.controller');

// [GET] /api/admin/seller/
router.get('/', manageSellerController.getAllSeller);

// [PATCH] /api/admin/seller/:sellerId/status
router.patch('/:sellerId/status', manageSellerController.updateSellerStatus);

module.exports = router;