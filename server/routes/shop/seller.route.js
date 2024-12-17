const express = require('express');
const router = express.Router();
const sellerController = require('../../controllers/shop/seller.controller');
const ROLES_LIST = require('../../config/roles_list');
const verifyRoles = require('../../middlewares/verifyRoles.middleware');
const verifyUserOwnership = require('../../middlewares/verifyUserOwnership.middleware');


// Get all sellers - allow all roles
router.route('/')
    .get(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Shop, ROLES_LIST.User), verifyUserOwnership, sellerController.getAllSellers)


// Get seller details by ID - allow all roles
router.route('/:id')
    .get(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Shop, ROLES_LIST.User), verifyUserOwnership, sellerController.getSellerById);

module.exports = router;