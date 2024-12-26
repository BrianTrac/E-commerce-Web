const verifyJWT = require('../../middlewares/verifyJWT.middleware');

const sellerRoutes = (app) => {

    // Middleware to verify JWT
    app.use(verifyJWT);

    // Routes for products
    app.use('/api/seller/products', require('./product.route')); // have not authenticated products yet (i.e. no JWT)

    // Routes for seller
    // app.use('/api/seller', require('./seller.route')); 
}

module.exports = sellerRoutes;