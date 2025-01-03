const express = require('express');
const router = express.Router();
const productController = require('../../controllers/admin/manageProduct.controller');

// [GET] /api/admin/products
router.get('/', productController.getAllProducts);

// [GET] /api/admin/products/:id
router.get('/:id', productController.getOneProduct);

router.put('/:id/suspend', productController.suspendProduct);

module.exports = router;