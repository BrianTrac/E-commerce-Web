const express = require('express');
const router = express.Router();
const productController = require('../../controllers/seller/product.controller');
const verifyRoles = require('../../middlewares/verifyRoles.middleware');
const ROLES_LIST = require('../../config/roles_list');


router.get('/', productController.getAllProductsByStoreId);

router.get('/:storeId/top-selling', productController.getTopSellingProducts_v1);

router.get('/top-selling', productController.getTopSellingProducts_v2);

router.get('/detail/:productId', productController.getProductById);

router.post('/add', productController.addProductToStore);

router.delete('/remove/:productId', productController.deleteProduct);

router.patch('/update/:productId', productController.updateProduct);

router.get('/top-selling/:storeId', productController.getTopSellingProducts_v2);

module.exports = router;