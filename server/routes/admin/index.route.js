const ROLES_LIST = require('../../config/roles_list');
const verifyRoles = require('../../middlewares/verifyRoles.middleware');


const adminRoutes = (app) => {
    // Routes
    app.use(verifyRoles(ROLES_LIST.Admin));
    app.use('/api/admin/seller', require('./manageSeller.route'));
    app.use('/api/admin/user', require('./manageUser.route'));
    app.use('/api/admin/products', require('./manageProduct.route'));
    app.use('/api/admin/statistic', require('./salesStatistics.route'));
}

module.exports = adminRoutes;

