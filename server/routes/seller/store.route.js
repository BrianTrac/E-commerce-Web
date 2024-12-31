const express = require('express');
const router = express.Router();
const storeController = require('../../controllers/seller/store.controller');

router.get('/', storeController.getStore);

module.exports = router;