const verifyJWT = require('../../middlewares/verifyJWT.middleware');

const sellerRoutes = (app) => {

    // Routes for products
    app.use('/api/seller/product', require('./product.route')); // have not authenticated products yet (i.e. no JWT)

    // Middleware to verify JWT
    app.use(verifyJWT);

    // Routes for seller
    app.use('/api/seller', require('./seller.route')); 
}

module.exports = sellerRoutes;