const express = require('express');
const router = express.Router();
const orderController = require('../../controllers/seller/order.controller');

router.get('/', orderController.getOrders);

router.patch('/:orderId', orderController.updateOrderStatus);

router.get('/potential-customer', orderController.getPotentialCustomer);

router.get('/recent', orderController.getRecentOrders);

router.get('/monthly-revenue', orderController.getMonthlyRevenue);

module.exports = router;