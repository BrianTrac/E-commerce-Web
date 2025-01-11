const Seller = require('../../models/Seller');
const Product = require('../../models/Product');
const { Op } = require('sequelize');

const getStore = async (req, res) => {
    const { storeId } = req.params;
    const { page = 1, limit = 24, query = '', sort = 'popular' } = req.query;

    try {
        const store = await Seller.findOne({ where: { store_id: storeId } });
        if (!store) {
            return res.status(404).json({ message: 'Store not found' });
        }

        const offset = (page - 1) * limit; // Calculate offset
        const whereCondition = {
            'current_seller.store_id': storeId,
            ...(query && {
                name: {
                    [Op.iLike]: `%${query}%`, // Case-insensitive search
                },
            }),
        };

        let order = [];
        switch (sort) {
            case 'best_selling':
                order = [['quantity_sold', 'DESC']];
                break;
            case 'price_asc':
                order = [['price', 'ASC']];
                break;
            case 'price_desc':
                order = [['price', 'DESC']];
                break;
            default:
                order = [['rating_average', 'DESC']]; // Popular by default
        }

        const { count, rows: products } = await Product.findAndCountAll({
            where: whereCondition,
            order,
            limit: parseInt(limit, 10),
            offset: parseInt(offset, 10),
        });

        return res.status(200).json({
            store,
            products,
            total_pages: Math.ceil(count / limit),
        });
    } catch (error) {
        console.error('Error fetching store or products:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};


module.exports = {
  getStore,
};
