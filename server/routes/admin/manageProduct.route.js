const express = require('express');
const router = express.Router();
const productController = require('../../controllers/admin/manageProduct.controller');

// [GET] /api/admin/products
router.get('/', productController.getAllProducts);

// [GET] /api/admin/products/:id
router.get('/:id', productController.getOneProduct);

// [PUT] /api/admin/products/:id/suspend
router.put('/:id/suspend', productController.suspendProduct);

// [PUT] /api/admin/products/:id/restore
router.put('/:id/restore', productController.restoreProduct);
module.exports = router;