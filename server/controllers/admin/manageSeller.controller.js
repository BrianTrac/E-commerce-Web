const Seller = require('../../models/Seller');
const Product = require('../../models/Product');

const { Op } = require('sequelize');


// [GET] /api/admin/seller/
const getAllSeller = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const search = req.query.search || '';

        const offset = (page - 1) * limit;

        const whereCondition = search ? {
            [Op.or]: [
                { name: { [Op.iLike]: `%${search}%` } },
                { info: { [Op.cast]: { [Op.iLike]: `%${search}%` } } }
            ]
        } : {};

        // Get total count for pagination
        const totalCount = await Seller.count({
            where: whereCondition
        });

        // Get sellers with pagination and search
        const sellers = await Seller.findAll({
            where: whereCondition,
            order: [['avg_rating_point', 'DESC']],
            limit: limit,
            offset: offset,
            attributes: [
                'id',
                'name',
                'avg_rating_point',
                'icon',
                'info',
                'review_count',
                'store_id',
                'total_follower',
                'url',
                'is_official'
            ]
        });

        res.status(200).json({
            data: sellers.map(seller => ({
                id: seller.id,
                name: seller.name,
                avg_rating_point: seller.avg_rating_point,
                icon: seller.icon,
                info: seller.info,
                review_count: seller.review_count,
                storeId: seller.store_id,
                total_follower: seller.total_follower,
                url: seller.url,
                isOfficial: seller.is_official
            })),
            total: totalCount,
            page: page,
            limit: limit
        });

    } catch (error) {
        console.error('Error in getAllSeller:', error);
        res.status(500).json({
            message: error.message,
            error: error
        });
    }
};

// [GET] /api/admin/seller/:id
const getOneSeller = async (req, res) => {
    try {
        const { id } = req.params;

        const seller = await Seller.findByPk(id, {
            attributes: [
                'id',
                'name',
                'avg_rating_point',
                'icon',
                'info',
                'review_count',
                'store_id',
                'total_follower',
                'url',
                'is_official'
            ]
        });

        if (!seller) {
            return res.status(404).json({
                message: 'Seller not found'
            });
        }

        res.status(200).json({
            data: [{
                id: seller.id,
                name: seller.name,
                avg_rating_point: seller.avg_rating_point,
                icon: seller.icon,
                info: seller.info,
                review_count: seller.review_count,
                storeId: seller.store_id,
                total_follower: seller.total_follower,
                url: seller.url,
                isOfficial: seller.is_official
            }],
            total: 1,
            page: 1,
            limit: 1
        });

    } catch (error) {
        console.error('Error in getAllSeller:', error);
        res.status(500).json({
            message: error.message,
            error: error
        });
    }
};

// [GET] /api/admin/seller/:id/products
const getAllSellerProducts = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        const { id } = req.params;

        const seller = await Seller.findByPk(id);
        if (!seller) {
            return res.status(404).json({
                message: 'Seller not found'
            });
        }
        const storeId = seller.store_id;

        // Count total products
        const totalCount = await Product.count({
            where: {
                'current_seller.store_id': storeId
            }
        });

        // Retrieve products with pagination
        const products = await Product.findAll({
            where: {
                'current_seller.store_id': storeId
            },
            attributes: [
                'id',
                'name',
                'category_id',
                'category_name',
                'original_price',
                'price',
                'rating_average',
                'discount_rate',
                'inventory_status',
                'thumbnail_url',
                'video_url',
                'qty',
                'quantity_sold',
                'specifications',
                'current_seller'
            ],
            offset: offset,
            limit: limit,
        });
        return res.status(200).json({
            data: products,
            total: totalCount,
            page: page,
            limit: limit
        });
    } catch (error) {
        console.error('Error in getAllProducts:', error);
        res.status(500).json({
            message: error.message,
            error: error
        });
    }
};

module.exports = {
    getAllSeller,
    getOneSeller,
    getAllSellerProducts
};