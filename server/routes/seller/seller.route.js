const express = require('express');
const router = express.Router();
<<<<<<< HEAD
const sellerController = require('../../controllers/shop/seller.controller');
const ROLES_LIST = require('../../config/roles_list');
const verifyRoles = require('../../middlewares/verifyRoles.middleware');
=======
const sellerController = require('../../controllers/seller/seller.controller');
// const ROLES_LIST = require('../../config/roles_list');
// const verifyRoles = require('../../middlewares/verifyRoles.middleware');
>>>>>>> feature/14-seller-with-ui


// // Get all sellers - allow all roles
// router.route('/')
<<<<<<< HEAD
//     .get(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Shop, ROLES_LIST.User), sellerController.getAllSellers)
=======
//     .get(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.User, ROLES_LIST.Seller), sellerController.getAllSellers)
>>>>>>> feature/14-seller-with-ui


// // Get seller details by ID - allow all roles
// router.route('/:id')
<<<<<<< HEAD
//     .get(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Shop, ROLES_LIST.User), sellerController.getSellerById);
=======
//     .get(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.User, ROLES_LIST.Seller), sellerController.getSellerById);

>>>>>>> feature/14-seller-with-ui


router.get('/revenue/total/:storeId', sellerController.getTotalRevenue);

router.get('/products/total/:storeId', sellerController.getTotalProducts);

router.get('/followers/total/:storeId', sellerController.getTotalFollowers);

router.get('/reviews/total/:storeId', sellerController.getTotalReviews);

<<<<<<< HEAD
=======

>>>>>>> feature/14-seller-with-ui
module.exports = router;