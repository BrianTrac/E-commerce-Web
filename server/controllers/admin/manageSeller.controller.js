const Seller = require('../../models/Seller');
const { Op } = require('sequelize');

const getAllSeller = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const search = req.query.search || '';

        // Calculate offset
        const offset = (page - 1) * limit;

        // Build search condition
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
                rating: seller.avg_rating_point,
                icon: seller.icon,
                info: seller.info,
                reviewCount: seller.review_count,
                storeId: seller.store_id,
                followers: seller.total_follower,
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

// FIX LATTER
const updateSellerStatus = async (req, res) => {
    try {
        const { sellerId } = req.params;
        const { status } = req.body;

        // Validate status
        const validStatuses = ['active', 'pending', 'suspended'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                message: 'Invalid status value'
            });
        }

        // Find and update seller
        const seller = await Seller.findByPk(sellerId);

        if (!seller) {
            return res.status(404).json({
                message: 'Seller not found'
            });
        }

        // Update status
        await seller.update({ status });

        // Get updated seller with product count
        const updatedSeller = await Seller.findByPk(sellerId, {
            attributes: [
                'id',
                'storeName',
                'email',
                'name',
                'status',
                'avg_rating_point',
                [
                    Seller.sequelize.literal('(SELECT COUNT(*) FROM Products WHERE Products.sellerId = Seller.id)'),
                    'products'
                ]
            ]
        });

        res.status(200).json({
            id: updatedSeller.id,
            storeName: updatedSeller.storeName,
            email: updatedSeller.email,
            name: updatedSeller.name,
            status: updatedSeller.status,
            products: updatedSeller.getDataValue('products'),
            rating: updatedSeller.avg_rating_point
        });

    } catch (error) {
        console.error('Error in updateSellerStatus:', error);
        res.status(500).json({
            message: 'Failed to update seller status',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

module.exports = {
    getAllSeller,
    updateSellerStatus
};