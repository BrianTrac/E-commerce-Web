const Seller = require('../../models/Seller');
const Product = require('../../models/Product');


// Get seller details by ID
// GET /api/seller/:id
let getSellerById = async (req, res) => {
    try {
        let storeId = req.params.id;
        const seller = await Seller.findByPk(storeId);
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
            attributes: ['id', 'name'] // return only id and name
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


// Get statistics of a store
// GET /api/seller/statistic/:storeId
let getSummaryStatistic = async (req, res) => {
    const storeId = req.params.storeId;

    try {
        const products = await Product.findAll({
            where: {
                'current_seller.store_id': storeId
            },
            attributes: ['id', 'name', 'price', 'quantity_sold', 'rating_average']
        });

        if (products.length === 0) {
            return res.status(404).json({ message: 'No products found for this store' });
        }

        const totalProducts = products.length;
        const totalRevenue = products.reduce((total, product) => total + parseInt(product.price), 0);

        return res.status(200).json({
            message: 'Statistic fetched successfully',
            totalProducts: totalProducts,
            totalRevenue: totalRevenue,
            products: products
            
        });
    } catch (error) {
        console.error('Error fetching statistic by store ID:', error);
        return res.status(500).json({ message: 'Server error' });
    }
};


module.exports = {
    getSellerById,
    getAllSellers,
    getSummaryStatistic
};