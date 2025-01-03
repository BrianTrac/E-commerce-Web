const express = require('express');
const router = express.Router();
const sellerController = require('../../controllers/seller/seller.controller');
// const ROLES_LIST = require('../../config/roles_list');
// const verifyRoles = require('../../middlewares/verifyRoles.middleware');


// // Get all sellers - allow all roles
// router.route('/')
//     .get(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.User, ROLES_LIST.Seller), sellerController.getAllSellers)


// // Get seller details by ID - allow all roles
// router.route('/:id')
//     .get(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.User, ROLES_LIST.Seller), sellerController.getSellerById);



router.get('/revenue/total', sellerController.getTotalRevenue);

router.get('/products/total', sellerController.getTotalProducts);

router.get('/followers/total', sellerController.getTotalFollowers);

router.get('/reviews/total', sellerController.getTotalReviews);

router.get('/products/exist/:id', sellerController.checkProductExist);


module.exports = router;