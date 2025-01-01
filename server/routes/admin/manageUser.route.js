const express = require('express');
const router = express.Router();
const manageUserController = require('../../controllers/admin/manageUser.controller');

// [GET] /api/admin/user/
router.get('/', manageUserController.getAllUser);

// [GET] /api/admin/user/:id
router.get('/:id', manageUserController.getOneUser);

// [GET] /api/admin/user/:id/products
router.get('/:id/products', manageUserController.getAllUserOrderList);

// [PUT] /api/admin/user/:id/activate
router.put('/:id/activate', manageUserController.activateUser);

// [PUT] /api/admin/user/:id/deactivate
router.put('/:id/deactivate', manageUserController.deactivateUser);

// [PUT] /api/admin/user/:id/total-spent
router.put('/:id/total-spent', manageUserController.getUserTotalSpent);

module.exports = router;