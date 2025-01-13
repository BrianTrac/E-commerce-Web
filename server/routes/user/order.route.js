const router = require('express').Router();

const orderController = require('../../controllers/user/order.controller');

router.get('/', orderController.getOrders);
router.get('/:orderId', orderController.getOrder);
router.post('/', orderController.createOrder);
router.post('/:orderId', orderController.updateOrder);
router.get('/user/:userId', orderController.getUserOrders);

module.exports = router;