const express = require('express');
const verifyJWT = require('../../middlewares/verifyJWT.middleware');

const adminRoutes = (app) => {
    // Routes
    app.use('/api/admin/seller', require('./manageSeller.route'));
    app.use('/api/admin/user', require('./manageUser.route'));
    app.use('/api/admin/products', require('./manageProduct.route'));
    app.use('/api/admin/statistic', require('./salesStatistics.route'));
}

module.exports = adminRoutes;

