const express = require('express');
const router = express.Router();
const usersController = require('../../controllers/user/users.controller');
const ROLES_LIST = require('../../config/roles_list');
const verifyRoles = require('../../middlewares/verifyRoles.middleware');
const verifyUserOwnership = require('../../middlewares/verifyUserOwnership.middleware');

router.route('/info')
    .get(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.User), usersController.getUserInfo);

router.route('/email/:email')
    .get(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.User), usersController.getUserByEmail);

router.route('/')
    .get(verifyRoles(ROLES_LIST.Admin), usersController.getAllUsers)
    .delete(verifyRoles(ROLES_LIST.Admin), usersController.deleteUser);

router.route('/:id')
    .get(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.User), verifyUserOwnership, usersController.getUserById);

module.exports = router;