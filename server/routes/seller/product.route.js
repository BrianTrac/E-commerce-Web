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

router.get('/:storeId/top-selling', productController.getTopSellingProducts);

router.get('/detail/:productId', productController.getProductById);

router.post('/add', productController.addProductToStore);

router.delete('/remove/:productId', productController.deleteProduct);

router.patch('/update/:productId', productController.updateProduct);



// router.get('/:storeId/paging', productController.getProductsByStoreId);

router.get('/top-selling/:storeId', productController.getTopSellingProducts);

// router.route('/top-selling/:storeId')
//     .get(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Shop, ROLES_LIST.User), productController.getTopSellingProducts)

// router.route('/flash-sale/:storeId')
//     .get(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Shop, ROLES_LIST.User), productController.getFlashSaleProducts)

module.exports = router;