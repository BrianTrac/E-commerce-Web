const express = require('express');
const router = express.Router();
const productController = require('../../controllers/seller/product.controller');
const verifyRoles = require('../../middlewares/verifyRoles.middleware');
const ROLES_LIST = require('../../config/roles_list');

// router.route('/:storeId/paging')
//     .get(verifyRoles(ROLES_LIST.Admin,ROLES_LIST.User, ROLES_LIST.Seller), productController.getProductsByStoreId)

// router.route('/:storeId')
//     .get(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Shop, ROLES_LIST.User, ROLES_LIST.Seller), productController.getAllProductsByStoreId)

// router.route('/add')
//     .post(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Shop, ROLES_LIST.Seller), productController.addProductToStore)

// router.route('/remove/:productId')
//     .delete(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Shop, ROLES_LIST.Seller), productController.deleteProduct)


router.get('/:storeId', productController.getAllProductsByStoreId);

router.get('/detail/:productId', productController.getProductById);

router.post('/add', productController.addProductToStore);

router.delete('/remove/:productId', productController.deleteProduct);



// router.get('/:storeId/paging', productController.getProductsByStoreId);

module.exports = router;