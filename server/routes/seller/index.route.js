const verifyJWT = require('../../middlewares/verifyJWT.middleware');

const sellerRoutes = (app) => {

    app.use(verifyJWT);

    // Routes for products
    app.use('/api/seller/products', require('./product.route')); // have not authenticated products yet (i.e. no JWT)

    // Routes for categories
    app.use('/api/seller/categories', require('./category.route')); // have not authenticated categories yet (i.e. no JWT)

    // Routes for store
    app.use('/api/seller/store', require('./store.route')); // have not authenticated seller yet (i.e. no JWT)

    // Routes for seller info
    app.use('/api/seller/info', require('./info.route')); // have not authenticated seller info yet (i.e. no JWT)
}
module.exports = sellerRoutes;