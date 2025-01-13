const verifyJWT = require('../../middlewares/verifyJWT.middleware');
const verifyRoles = require('../../middlewares/verifyRoles.middleware');
const ROLES_LIST = require('../../config/roles_list');

const sellerRoutes = (app) => {

    app.use(verifyJWT);

    // Routes for products
    app.use('/api/seller/products', verifyRoles(ROLES_LIST.Seller), require('./product.route'));

    // Routes for categories
    app.use('/api/seller/categories', verifyRoles(ROLES_LIST.Seller), require('./category.route')); 

    // Routes for store
    app.use('/api/seller/store', verifyRoles(ROLES_LIST.Seller), require('./store.route')); 

    // Routes for seller info
    app.use('/api/seller/info', verifyRoles(ROLES_LIST.Seller), require('./info.route')); 

    // Routes for seller
    app.use('/api/seller', verifyRoles(ROLES_LIST.Seller), require('./seller.route')); 

    // Routes for vouchers
    app.use('/api/seller/voucher', verifyRoles(ROLES_LIST.Seller), require('./voucher.route')); 

    // Routes for orders
    app.use('/api/seller/orders', verifyRoles(ROLES_LIST.Seller), require('./order.route')); 
}

module.exports = sellerRoutes;