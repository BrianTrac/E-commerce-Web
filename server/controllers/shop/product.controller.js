// Desc: Product controller
const Product = require('../../models/Product');
const Sequelize = require('sequelize');


// Get all products by store ID
// GET /api/seller/product/:storeId
let getAllProductsByStoreId = async (req, res) => {
    const storeId = req.params.storeId;

    if (!storeId) {
        return res.status(400).json({ message: 'storeId ID is required' });
    }
    
    try {
        const products = await Product.findAll({
            where: {
                'current_seller.store_id': storeId
            },
            attributes: ['id', 'name', 'price']  // Get id, name, and price only
        });

        if (products.length === 0) {
            return res.status(404).json({ message: 'No products found for this store' });
        }

        return res.status(200).json({
            message: 'Products fetched successfully',
            products: products
        });
    } catch (error) {
        console.error('Error fetching products by store ID:', error);
        return res.status(500).json({ message: 'Server error' });
    }
};


// Get products by store ID with pagination
// GET /api/seller/product/:storeId/paging?limit=10&page=1
let getProductsByStoreId = async (req, res) => {
    const storeId = req.params.storeId;
    console.log('storeId:', storeId);
    const page = parseInt(req.query.page) || 1;     // Page number, deafult is 1
    const limit = parseInt(req.query.limit) || 10; // Items per page, default is 10 items
    const offset = (page - 1) * limit;

    console.log('page:', page);
    console.log('perPage:', limit);
    console.log('offset:', offset);

    try {
        const { count, rows: products } = await Product.findAndCountAll({
            where: { 'current_seller.store_id': storeId }, 
            limit: limit, 
            offset: offset,
        });

        res.status(200).json({
            storeId: storeId,
            currentPage: page,     
            count: products.length,   
            totalProducts: count,    
            totalPages: Math.ceil(count / limit), 
            products: products       
        });
    } catch (error) {
        console.error('Error fetching products by shop ID', error);
        res.status(500).json({ message: 'Server error' });
    }
};


// Add a product to a store
// POST /api/seller/product/add
let addProductToStore = async (req, res) => {
    try {
        const productData = req.body;
        console.log('productData:', productData);
        const newProduct = await Product.create(productData);
        res.status(201).json({ message: "Product created", product: newProduct });
    } catch (error) {
        console.error('Error adding product to store:', error);
        res.status(500).json({ message: "Error adding product to store" });
    }
};


// Remove a product from a store
// DELETE /api/seller/product/remove/:id
let deleteProduct = async (req, res) => {
    const productId = req.params.id;

    try {
        const result = await Product.destroy({
            where: {
                id: productId
            }
        });
        if (result === 0) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json({ message: "Product deleted" });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ message: "Error deleting product" });
    }
};

module.exports = {
    getAllProductsByStoreId,
    getProductsByStoreId,
    addProductToStore,
    deleteProduct
};