const verifyJWT = require('../../middlewares/verifyJWT.middleware');

const sellerRoutes = (app) => {

    // Routes for products
    app.use('/api/seller/products', require('./product.route')); // have not authenticated products yet (i.e. no JWT)

    // Routes for categories
    app.use('/api/seller/categories', require('./category.route')); // have not authenticated categories yet (i.e. no JWT)

    //app.use(verifyJWT); // All routes below this line will require JWT  
    // Routes for seller
    app.use('/api/seller', require('./seller.route')); // have not authenticated seller yet (i.e. no JWT)
}

module.exports = sellerRoutes;