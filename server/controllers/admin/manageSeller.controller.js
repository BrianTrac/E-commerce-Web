const Seller = require('../../models/Seller');

const getAllSeller = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const page = parseInt(req.query.page) || 1;
        const per_page = parseInt(req.query.per_page) || 10;

        const offset = (page - 1) * per_page;

        const MAX_SELLER = await Seller.count();
        const total_pages = Math.ceil(MAX_SELLER / per_page);


        const sellers = await Seller.findAll({
            order: [['avg_rating_point', 'DESC']],
            limit: per_page,
            offset: offset,
        });

        res.status(200).json({
            data: sellers,
            paging: {
                current_page: page,
                total_pages: total_pages,
                total_items: sellers.length,
                items_per_page: limit,
            },
            title: 'Seller List',
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAllSeller,
};
