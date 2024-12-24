const express = require('express');
const verifyJWT = require('../../middlewares/verifyJWT.middleware');

const adminRoutes = (app) => {
    // Routes
    app.use('/api/admin/seller', require('./manageSeller.route'));
}

module.exports = adminRoutes;

