const express = require('express');
const verifyJWT = require('../../middlewares/verifyJWT.middleware');

const userRoutes = (app) => {
    // Routes
    app.use('/api/auth/register', require('./register.route'));
    app.use('/api/auth/login', require('./login.route'));
    app.use('/api/auth/token/refresh', require('./refreshToken.route'));
    app.use('/api/auth/logout', require('./logout.route'));
    app.use('/api/auth/forget-password', require('./forgetPassword.route'));
    app.use('/api/auth/reset-password', require('./resetPassword.route'));

    // Google and Facebook OAuth routes
    app.use('/api/auth/google', require('./google-auth.route'));
    // app.use('/api/auth/facebook', require('./facebook-auth.route'));

    // Middleware to verify JWT
    app.use(verifyJWT);

     // Routes for products
     app.use('/api/products', require('./product.route')); // have not authenticated users yet (i.e. no JWT)

    // User routes
    app.use('/api/users', require('./users.route'));
}

module.exports = userRoutes;

