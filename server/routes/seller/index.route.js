const verifyJWT = require('../../middlewares/verifyJWT.middleware');

const sellerRoutes = (app) => {

    app.use(verifyJWT);

    // Routes for products
    app.use('/api/seller/products', require('./product.route'));

    // Routes for categories
    app.use('/api/seller/categories', require('./category.route')); 

    // Routes for store
    app.use('/api/seller/store', require('./store.route')); 

    // Routes for seller info
    app.use('/api/seller/info', require('./info.route')); 

    // Routes for seller
    app.use('/api/seller', require('./seller.route')); 

    // Routes for vouchers
    app.use('/api/seller/voucher', require('./voucher.route')); 

    // Routes for orders
    app.use('/api/seller/orders', require('./order.route')); 
}

module.exports = sellerRoutes;