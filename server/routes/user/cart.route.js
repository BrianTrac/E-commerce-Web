const router = require('express').Router();
const cartController = require('../../controllers/user/cart.controller');

// Get all items in the cart
router.get('/', cartController.getCartItems);
router.post('/items', cartController.addToCartItem);
router.post('/items/remove', cartController.deleteCartItem);
router.post('/items/:itemId([0-9]+)', cartController.updateCartItem);
router.get('/items/summary', cartController.getCartSummary);

module.exports = router;