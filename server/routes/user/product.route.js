const express = require('express');
const router = express.Router();
const productController = require('../../controllers/user/product.controller');

router.post('/', productController.createNewProduct); // method POST - Create

//router.get('/', productController.getAllProducts); // method GET - Read
router.get('/', (req, res, next) => {
    if (Object.keys(req.query).length > 0) {
        productController.searchProducts(req, res);
    } else {
        productController.getAllProducts(req, res);
    }
});

// [GET] /products/:id/related
router.get('/:id/related', productController.getRelatedProducts);

router.get('/', productController.getProductById); // method GET - Read

router.get('/search/suggestion', productController.getSuggestions); // method GET Suggestions

router.get('/top_deals', productController.getTopDeals); // method GET Top Deals

router.get('/flash_sale', productController.getFlashSale); // method GET Flash Sale

router.get('/:id', productController.detail); // method GET - Read

router.put('/:id', productController.updateProduct); // method PUT - Update

router.delete('/:id', productController.deleteProduct); // method DELETE - Delete

module.exports = router;