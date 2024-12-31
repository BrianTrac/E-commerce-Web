const Seller = require('../../models/Seller');
const Product = require('../../models/Product');
const { get } = require('http');


// Get seller details by ID
// GET /api/seller/:id
let getSellerById = async (req, res) => {
    try {
        let storeId = req.params.id;
        const seller = await Seller.findOne({
            where: {
                store_id: storeId
            }
        });
        if (seller) {
            res.status(200).json(seller);
        } else {
            res.status(404).json({ message: 'Seller not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all sellers
// GET /api/seller
let getAllSellers = async (req, res) => {
    try {
        const sellers = await Seller.findAll({
            attributes: ['id', 'name', 'store_id'] // return only id and name
        });
        if (sellers.length) {
            res.status(200).json(sellers);
        } else {
            res.status(404).json({ message: 'No sellers found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


// Get total revenue of a store
// GET /api/seller/revenue/total/:storeId
let getTotalRevenue = async (req, res) => {
    const storeId = req.params.storeId;

    if (!storeId) {
        return res.status(400).json({ message: 'Store ID is required' });
    }

    try {
        const products = await Product.findAll({
            where: {
                'current_seller.store_id': storeId
            },
            attributes: ['id', 'name', 'price', 'quantity_sold']
        });

        if (products.length === 0) {
            return res.status(404).json({ message: 'No products found for this store' });
        }

        const totalRevenue = products.reduce((total, product) => total + parseInt(product.price) * product.quantity_sold, 0);

        return res.status(200).json({
            message: 'Total revenue fetched successfully',
            totalRevenue: totalRevenue,
        });
    } catch (error) {
        console.error('Error fetching statistic by store ID:', error);
        return res.status(500).json({ message: 'Server error' });
    }
};


// Get total products of a store
// GET /api/seller/products/total/:storeId
let getTotalProducts = async (req, res) => {
    const storeId = req.params.storeId;

    if (!storeId) {
        return res.status(400).json({ message: 'Store ID is required' });
    }

    try {
        const products = await Product.findAll({
            where: { 
                'current_seller.store_id': storeId
            },
            attributes: ['id', 'name'] // return only id and name
        });
        if (products.length) {
            res.status(200).json({
                message: 'Total products fetched successfully',
                totalProducts: products.length
        });
        } else {
            res.status(404).json({ message: 'No products found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Get total followers of a store
// GET /api/seller/followers/total/:storeId
let getTotalFollowers = async (req, res) => {
    const storeId = req.params.storeId;

    if (!storeId) {
        return res.status(400).json({ message: 'Store ID is required' });
    }

    try {
        const seller = await Seller.findOne({
            where: {
                store_id: storeId
            },
            attributes: ['total_follower']
        });

        if (seller) {
            res.status(200).json({
                message: 'Total followers fetched successfully',
                totalFollowers: seller.total_follower
            });
        } else {
            res.status(404).json({ message: 'No followers found for this store' });
        }
    } catch (error) {
        console.error('Error fetching total followers:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};



// Get total reviews of a store
// GET /api/seller/reviews/total/:storeId
let getTotalReviews = async (req, res) => {
    const storeId = req.params.storeId;

    if (!storeId) {
        return res.status(400).json({ message: 'Store ID is required' });
    }

    try {
        const seller = await Seller.findOne({
            where: { 
                store_id: storeId
            },
            attributes: ['review_count']
        });
        if (seller) {
            res.status(200).json({
                message: 'Total reviews fetched successfully',
                totalReviews: seller.review_count
        });
        } else {
            res.status(404).json({ message: 'No reviews found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


module.exports = {
    getSellerById,
    getAllSellers,
    getTotalRevenue,
    getTotalFollowers,
    getTotalProducts,
    getTotalReviews
};