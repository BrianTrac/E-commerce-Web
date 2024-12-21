const Seller = require('../../models/Seller');


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

module.exports = {
    getSellerById,
    getAllSellers
};