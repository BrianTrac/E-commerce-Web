const express = require('express');
const router = express.Router();
const categoryController = require('../../controllers/seller/category.controller');

router.get('/', categoryController.getAllCategories);

module.exports = router;