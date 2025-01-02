const express = require('express');
const router = express.Router();
const orderController = require('../../controllers/seller/order.controller');

router.get('/', orderController.getOrders);

router.patch('/:orderId', orderController.updateOrderStatus);

module.exports = router;