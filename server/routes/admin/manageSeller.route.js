const express = require('express');
const router = express.Router();
const manageSellerController = require('../../controllers/admin/manageSeller.controller');

// [GET] /api/admin/seller/
router.get('/', manageSellerController.getAllSeller);

// [GET] /api/admin/seller/:id
router.get('/:id', manageSellerController.getOneSeller);

// [PATCH] /api/admin/seller/:sellerId/status
router.patch('/:sellerId/status', manageSellerController.updateSellerStatus);

module.exports = router;