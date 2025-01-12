const express = require('express');
const router = express.Router();

const storeController = require('../../controllers/user/store.controller');

router.get('/:storeId', storeController.getStore);

module.exports = router;