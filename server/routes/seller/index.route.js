
const sellerRoutes = (app) => {

    // Routes for products
    app.use('/api/seller/products', require('./product.route')); // have not authenticated products yet (i.e. no JWT)

    // Routes for categories
    app.use('/api/seller/categories', require('./category.route')); // have not authenticated categories yet (i.e. no JWT)
}

module.exports = sellerRoutes;