const ROLES_LIST = require('../../config/roles_list');
const verifyRoles = require('../../middlewares/verifyRoles.middleware');


const adminRoutes = (app) => {
    // Routes
    // app.use(verifyRoles(ROLES_LIST.Admin));
    app.use('/api/admin/seller', verifyRoles(ROLES_LIST.Admin), require('./manageSeller.route'));
    app.use('/api/admin/user', verifyRoles(ROLES_LIST.Admin), require('./manageUser.route'));
    app.use('/api/admin/products', verifyRoles(ROLES_LIST.Admin), require('./manageProduct.route'));
    app.use('/api/admin/statistic', verifyRoles(ROLES_LIST.Admin), require('./salesStatistics.route'));
}

module.exports = adminRoutes;