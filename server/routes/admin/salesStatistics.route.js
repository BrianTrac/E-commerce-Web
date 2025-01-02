const express = require('express');
const router = express.Router();
const dashboardController = require('../../controllers/admin/dashboard.controller');

// [GET] /api/admin/statistic/userGrowth
router.get('/userGrowth', dashboardController.getUserGrowth);
// [GET] /api/admin/statistic/customers
router.get('/customers', dashboardController.getRecentCustomer);
// [GET] /api/admin/statistic/seller
router.get('/topSellers', dashboardController.getTopSeller);
// [GET] /api/admin/statistic/orders
router.get('/orders', dashboardController.getRecentOrders);


module.exports = router;