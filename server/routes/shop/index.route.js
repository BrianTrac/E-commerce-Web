const express = require('express');
const verifyJWT = require('../../middlewares/verifyJWT.middleware');

const shopRoutes = (app) => {
    // Routes
    app.use('/api/seller/test', (req, res) => {
        res.status(200).send('Seller API works');
    });
}

module.exports = shopRoutes;

