const express = require('express');
const router = express.Router();
const categoryController = require('../../controllers/seller/category.controller');

router.get('/', (req, res, next) => { console.log('HERE'); next(); }, categoryController.getAllCategories);
module.exports = router;