const express = require('express');
const router = express.Router();
const productController = require('../../controllers/shop/product.controller');
const verifyRoles = require('../../middlewares/verifyRoles.middleware');
const ROLES_LIST = require('../../config/roles_list');

router.route('/:storeId/paging')
    .get(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Shop, ROLES_LIST.User), productController.getProductsByStoreId)

router.route('/:storeId')
    .get(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Shop, ROLES_LIST.User), productController.getAllProductsByStoreId)

router.route('/add')
    .post(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Shop), productController.addProductToStore)

router.route('/remove/:productId')
    .delete(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Shop), productController.deleteProduct)

router.route('/top-selling/:storeId')
    .get(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Shop, ROLES_LIST.User), productController.getTopSellingProducts)

router.route('/flash-sale/:storeId')
    .get(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Shop, ROLES_LIST.User), productController.getFlashSaleProducts)


module.exports = router;