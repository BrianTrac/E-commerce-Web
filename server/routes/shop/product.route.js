const express = require('express');
const router = express.Router();
const productController = require('../../controllers/shop/product.controller');


router.get('/:storeId', productController.getAllProductsByStoreId);

router.get('/:storeId/paging', productController.getProductsByStoreId);

module.exports = router;