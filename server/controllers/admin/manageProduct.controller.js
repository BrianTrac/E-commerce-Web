const Product = require('../../models/Product');
const { Op } = require('sequelize');

// [GET] /api/admin/products
const getAllProducts = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const search = req.query.search || '';

        const offset = (page - 1) * limit;

        const whereCondition = search ? {
            [Op.or]: [
                { name: { [Op.iLike]: `%${search}%` } },
                { description: { [Op.iLike]: `%${search}%` } }
            ]
        } : {};

        // Get total count for pagination
        const totalCount = await Product.count({
            where: whereCondition
        });

        // Get products with pagination and search
        const products = await Product.findAll({
            where: whereCondition,
            order: [['name', 'ASC']],
            limit: limit,
            offset: offset,
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
                'current_seller',
            ]
        });

        res.status(200).json({
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

// [GET] /api/admin/products/:id
const getOneProduct1 = async (req, res) => {
    const productId = req.params.id;
    try {
        const product = await Product.findByPk(productId, {
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
                'current_seller',
            ]
        });

        if (!product) {
            return res.status(404).json({
                message: 'Product not found'
            });
        }

        res.status(200).json({
            data: product
        });

    } catch (error) {
        console.error('Error in getOneProduct:', error);
        res.status(500).json({
            message: error.message,
            error: error
        });
    }
};

const getOneProduct = async (req, res) => {
    try {
        const { id } = req.params;

        const product = await Product.findByPk(id, {
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
                'current_seller',
            ]
        });

        if (!product) {
            return res.status(404).json({
                message: 'Product not found'
            });
        }

        res.status(200).json({
            data: [{
                id: product.id,
                name: product.name,
                category_id: product.category_id,
                category_name: product.category_name,
                original_price: product.original_price,
                price: product.price,
                rating_average: product.rating_average,
                discount_rate: product.rating_average,
                inventory_status: product.inventory_status,
                thumbnail_url: product.thumbnail_url,
                video_url: product.video_url,
                qty: product.qty,
                quantity_sold: product.quantity_sold,
                specifications: product.specifications,
                current_seller: product.current_seller,
            }],
            total: 1,
            page: 1,
            limit: 1
        });

    } catch (error) {
        console.error('Error in getOneProduct:', error);
        res.status(500).json({
            message: error.message,
            error: error
        });
    }
};

module.exports = {
    getAllProducts,
    getOneProduct,
};