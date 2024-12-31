const express = require('express');
const router = express.Router();
const sellerController = require('../../controllers/shop/seller.controller');
const ROLES_LIST = require('../../config/roles_list');
const verifyRoles = require('../../middlewares/verifyRoles.middleware');


// // Get all sellers - allow all roles
// router.route('/')
//     .get(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Shop, ROLES_LIST.User), sellerController.getAllSellers)


// // Get seller details by ID - allow all roles
// router.route('/:id')
//     .get(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Shop, ROLES_LIST.User), sellerController.getSellerById);


router.get('/revenue/total/:storeId', sellerController.getTotalRevenue);

router.get('/products/total/:storeId', sellerController.getTotalProducts);

router.get('/followers/total/:storeId', sellerController.getTotalFollowers);

router.get('/reviews/total/:storeId', sellerController.getTotalReviews);

module.exports = router;