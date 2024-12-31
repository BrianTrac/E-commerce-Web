const express = require('express');
const router = express.Router();
const infoController = require('../../controllers/seller/info.controller');

router.get('/', infoController.getSellerInfo);

router.post('/create', infoController.createSellerInfo);

router.patch('/update', infoController.updateSellerInfo);

module.exports = router;