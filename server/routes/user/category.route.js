const express = require('express');
const router = express.Router();
const categoryController = require('../../controllers/user/category.controller');

router.get('/', categoryController.getCategoryTree);
router.get('/listings', categoryController.getProductsByCategory);

module.exports = router;