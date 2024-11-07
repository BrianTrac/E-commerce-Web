const express = require('express');
const router = express.Router();
const productController = require('../../controllers/user/product.controller');

router.post('/', productController.createNewProduct); // method POST - Create

router.get('/', productController.getAllProducts); // method GET - Read
router.get('/:id', productController.getProductById); // method GET - Read

router.put('/:id', productController.updateProduct); // method PUT - Update

router.delete('/:id', productController.deleteProduct); // method DELETE - Delete

module.exports = router;