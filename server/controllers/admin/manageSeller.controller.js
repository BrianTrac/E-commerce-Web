const Seller = require('../../models/Seller');
const Product = require('../../models/Product');
const { Op, QueryTypes } = require('sequelize');
const sequelize = require('../../config/db');


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
                'is_official',
                'is_active'
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
                isOfficial: seller.is_official,
                is_active: seller.is_active
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
                'is_official',
                'is_active'
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
                isOfficial: seller.is_official,
                is_active: seller.is_active
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
        const search = req.query.search || ''; // Get search query
        const { id } = req.params;

        const seller = await Seller.findByPk(id);
        if (!seller) {
            return res.status(404).json({
                message: 'Seller not found'
            });
        }
        const storeId = seller.store_id;

        // Filter conditions
        const whereCondition = {
            'current_seller.store_id': storeId
        };

        // Add search condition if provided
        if (search) {
            whereCondition.name = { [Op.like]: `%${search}%` }; // Search by product name
        }

        // Count total products matching the condition
        const totalCount = await Product.count({
            where: whereCondition
        });

        // Retrieve products with pagination and filters
        const products = await Product.findAll({
            where: whereCondition,
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
        console.error('Error in getAllSellerProducts:', error);
        res.status(500).json({
            message: error.message,
            error: error
        });
    }
};


// [PUT] /api/admin/seller/:id/activate
const activateSeller = async (req, res) => {
    const user_id = req.params.id;
    try {
        const seller = await Seller.findByPk(user_id);
        if (!seller) {
            return res.status(404).json({
                message: 'Seller not found'
            });
        }
        seller.is_active = true;
        await seller.save();
        res.status(200).json({
            message: 'Activated seller successfully',
            data: seller
        });
    } catch (error) {
        console.error('Error in activateSeller:', error);
        res.status(500).json({
            message: error.message,
            error: error
        });
    }
};

// [PUT] /api/admin/seller/:id/deactivate
const deactivateSeller = async (req, res) => {
    const user_id = req.params.id;
    try {
        const seller = await Seller.findByPk(user_id);
        if (!seller) {
            return res.status(404).json({
                message: 'Seller not found'
            });
        }
        seller.is_active = false;
        await seller.save();
        res.status(200).json({
            message: 'Deactivated seller successfully',
            data: seller
        });
    } catch (error) {
        console.error('Error in deactivateSeller:', error);
        res.status(500).json({
            message: error.message,
            error: error
        });
    }
};

// [GET] /api/admin/seller/:id/statistics
const getSellerStatistics = async (req, res) => {
    const user_id = req.params.id;
    try {
        const categoryStat = `
            SELECT 
                seller_id, 
                category_id, 
                category_name, 
                SUM(total_sales) AS total_sales
            FROM (
                SELECT
                    (current_seller->>'id')::INT AS seller_id,
                    SUM(quantity_sold * (current_seller->>'price')::NUMERIC) AS total_sales,
                    cat.id AS category_id,
                    cat.name AS category_name
                FROM
                    product p
                LEFT JOIN
                    category cat
                ON
                    cat.id = p.category_id
                WHERE
                    (current_seller->>'id')::INT = ${user_id} AND cat.id IS NOT NULL
                GROUP BY
                    (current_seller->>'id')::INT,
                    cat.id,
                    cat.name
            ) AS sellerStat
            GROUP BY
                seller_id, 
                category_id, 
                category_name;
        `;
        const catResult = await sequelize.query(categoryStat, { type: QueryTypes.SELECT });

        // Calculate total statistics for the seller
        const totalProducts = catResult.length;
        const totalRevenue = catResult.reduce((sum, row) => sum + parseFloat(row.total_sales || 0), 0);

        // Select top 20 categories has the highest total sales
        catResult.sort((a, b) => b.total_sales - a.total_sales);
        const topCategories = catResult.slice(0, 20);
        const minorTotalSales = totalRevenue - topCategories.reduce((sum, row) => sum + parseFloat(row.total_sales || 0), 0);
        if (minorTotalSales > 0) {
            topCategories.push({
                category_id: -1,
                category_name: 'Others',
                total_sales: minorTotalSales
            });
        }

        const productStat = `
            SELECT
                product.id,
                product.name,
                (images[1]::JSONB->>'base_url') AS thumbnail_url, 
                quantity_sold * (current_seller->>'price')::NUMERIC AS total_sales
            FROM product
            JOIN category ON category.id = product.category_id
            WHERE (current_seller->>'id')::INT = ${user_id}
        `;
        const productResult = await sequelize.query(productStat, { type: QueryTypes.SELECT });
        // Select top 10 products has the highest total sales
        productResult.sort((a, b) => b.total_sales - a.total_sales);
        const topProducts = productResult.slice(0, 10);

        res.status(200).json({
            data: {
                totalProducts: totalProducts,
                totalRevenue: totalRevenue,
                categories: topCategories,
                products: topProducts,
            }
        });
    } catch (error) {
        console.error('Error in getSellerStatistics:', error);
        res.status(500).json({
            message: error.message,
            error: error
        });
    }
};

// [PATCH] /api/admin/seller/:id/products/:productId/suspend
const suspendSellerProduct = async (req, res) => {
    const { id, productId } = req.params;
    try {
        const seller = await Seller.findByPk(id);
        if (!seller) {
            return res.status(404).json({
                message: 'Seller not found'
            });
        }

        // Verify the product exists and belongs to the seller
        const product = await Product.findByPk(productId);
        if (!product || product.current_seller.store_id !== seller.store_id) {
            return res.status(404).json({ message: 'Product not found for this seller' });
        }

        product.inventory_status = 'suspend';
        await product.save();
        res.status(200).json({
            message: 'Product is temporarily suspended',
        });
    } catch (error) {
        console.log('Error in suspendSellerProduct:', error);
        res.status(500).json({
            message: error.message,
            error: error
        });
    }
};

// [PATCH] /api/admin/seller/:id/products/:productId/unsuspend
const unsuspendProduct = async (req, res) => {
    try {
        const { id, productId } = req.params;

        // Verify the seller exists
        const seller = await Seller.findByPk(id);
        if (!seller) {
            return res.status(404).json({ message: 'Seller not found' });
        }

        // Verify the product exists and belongs to the seller
        const product = await Product.findByPk(productId);
        if (!product || product.current_seller.store_id !== seller.store_id) {
            return res.status(404).json({ message: 'Product not found for this seller' });
        }

        // Update product status to available
        product.inventory_status = 'available';
        await product.save();
        return res.status(200).json({ message: 'Product unsuspended successfully' });
    } catch (error) {
        console.error('Error unsuspending product:', error);
        res.status(500).json({ message: error.message });
    }
};

// [PATCH] /api/admin/seller/:id/products/:productId/approve
const approveProduct = async (req, res) => {
    try {
        const { id, productId } = req.params;

        // Verify the seller exists
        const seller = await Seller.findByPk(id);
        if (!seller) {
            return res.status(404).json({ message: 'Seller not found' });
        }

        // Verify the product exists and belongs to the seller
        const product = await Product.findByPk(productId);
        if (!product || product.current_seller.store_id !== seller.store_id) {
            return res.status(404).json({ message: 'Product not found for this seller' });
        }

        // Update product status to available
        product.inventory_status = 'available';
        await product.save();

        return res.status(200).json({ message: 'Product unsuspended successfully' });
    } catch (error) {
        console.error('Error unsuspending product:', error);
        res.status(500).json({ message: error.message });
    }
};

// [PUT] /api/admin/seller/:id/edit
const editSeller = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, isOfficial, icon } = req.body;

        const seller = await Seller.findByPk(id);
        if (!seller) {
            return res.status(404).json({ message: 'Seller not found' });
        }
        if (name) {
            seller.name = name;
        }
        if (isOfficial) {
            seller.is_official = isOfficial;
        }
        if (icon) {
            seller.icon = icon;
        }
        await seller.save();

        res.status(200).json({ message: 'Edit seller successfully' });
    } catch {
        res.status(500).json({ message: error.message });
    }
};
module.exports = {
    getAllSeller,
    getOneSeller,
    getAllSellerProducts,
    activateSeller,
    deactivateSeller,
    getSellerStatistics,
    suspendSellerProduct,
    unsuspendProduct,
    approveProduct,
    editSeller,
};