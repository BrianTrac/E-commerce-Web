const express = require('express');
const router = express.Router();
const manageSellerController = require('../../controllers/admin/manageSeller.controller');

// [GET] /api/admin/seller/
router.get('/', manageSellerController.getAllSeller);

// [GET] /api/admin/seller/:id
router.get('/:id', manageSellerController.getOneSeller);

// [GET] /api/admin/seller/:id/products
router.get('/:id/products', manageSellerController.getAllSellerProducts);

// [PUT] /api/admin/seller/:id/edit
router.put('/:id/edit', manageSellerController.editSeller);

// [PUT] /api/admin/seller/:id/activate
router.put('/:id/activate', manageSellerController.activateSeller);

// [PUT] /api/admin/seller/:id/deactivate
router.put('/:id/deactivate', manageSellerController.deactivateSeller);

// [GET] /api/admin/seller/:id/statistics
router.get('/:id/statistics', manageSellerController.getSellerStatistics);

// [PATCH] /api/admin/seller/:id/products/:productId/suspend
router.patch('/:id/products/:productId/suspend', manageSellerController.suspendSellerProduct);

// [PATCH] /api/admin/seller/:id/products/:productId/unsuspend
router.patch('/:id/products/:productId/unsuspend', manageSellerController.unsuspendProduct);

// [PATCH] /api/admin/seller/:id/products/:productId/approve
router.patch('/:id/products/:productId/approve', manageSellerController.approveProduct);


module.exports = router;