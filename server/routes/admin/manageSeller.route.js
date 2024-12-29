const express = require('express');
const router = express.Router();
const manageSellerController = require('../../controllers/admin/manageSeller.controller');

// [GET] /api/admin/seller/
router.get('/', manageSellerController.getAllSeller);

// [GET] /api/admin/seller/:id
router.get('/:id', manageSellerController.getOneSeller);

// [GET] /api/admin/seller/:id/products
router.get('/:id/products', manageSellerController.getAllSellerProducts);

// [PUT] /api/admin/seller/:id/activate
router.put('/:id/activate', manageSellerController.activateSeller);

// [PUT] /api/admin/seller/:id/deactivate
router.put('/:id/deactivate', manageSellerController.deactivateSeller);

module.exports = router;