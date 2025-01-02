const OrderItem = require('../../models/OrderItem');
const Product = require('../../models/Product');
const Order = require('../../models/Order');
const User = require('../../models/User');
const sequelize = require('../../config/db');


// [GET] /api/admin/statistic/orders
const getRecentOrders = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;

        // Get order items with associated product information
        const orderItems = await OrderItem.findAll({
            limit: limit,
            order: [['updated_at', 'DESC']],
            include: [
                {
                    model: Product,
                    as: 'Product',
                    attributes: ['id', 'name', 'price', 'thumbnail_url']
                },
                {
                    model: Order,
                    as: 'Order',
                    attributes: ['status']
                }
            ]
        });

        res.status(200).json({
            data: orderItems,
            total: orderItems.length,
            limit: limit
        });

    } catch (error) {
        console.error('Error in getRecentOrders:', error);
        res.status(500).json({
            message: error.message,
            error: error
        });
    }
};

// [GET] /api/admin/statistic/customers
const getRecentCustomer = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;

        // Get order items with associated product information
        const result = await Order.findAll({
            limit: limit,
            order: [['updated_at', 'DESC']],
            include: [
                {
                    model: User,
                    as: 'User',
                    attributes: ['id', 'username', 'email']
                },
            ]
        });

        let recentCustomers = [];
        for (let i = 0; i < result.length; i++) {
            recentCustomers.push({
                id: result[i].User.id,
                username: result[i].User.username,
                email: result[i].User.email,
                order_id: result[i].id,
                order_status: result[i].status,
                order_date: result[i].updated_at,
                order_total: result[i].total_price
            });
        }

        res.status(200).json({
            data: recentCustomers,
            total: recentCustomers.length,
            limit: limit
        });

    } catch (error) {
        console.error('Error in getRecentOrders:', error);
        res.status(500).json({
            message: error.message,
            error: error
        });
    }
};
// [GET] /api/admin/statistic/seller
const getTopSeller = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit, 10) || 10;
        const topSellers = await sequelize.query(
            `
                WITH top_seller AS (
                    SELECT
                        CAST(product.current_seller->>'store_id' AS INTEGER) AS store_id,
                        SUM(order_items.price * order_items.quantity) AS total_sale,
                        SUM(order_items.quantity) AS total_sold,
                        SUM((order_items.price - (product.current_seller->>'price')::INT)*order_items.quantity) AS earnings
                    FROM
                        order_items
                    LEFT JOIN
                        product
                    ON
                        product.id = order_items.product_id
                    GROUP BY
                        product.current_seller->>'store_id'
                    ORDER BY
                        total_sale DESC
                    LIMIT :limit
                )
                SELECT
                    seller.store_id,
                    seller.icon,
                    seller.name,
                    top_seller.total_sale,
                    top_seller.total_sold,
                    seller.is_official,
                    top_seller.earnings
                FROM
                    top_seller
                JOIN
                    seller
                ON
                    seller.store_id = top_seller.store_id;
            `,
            {
                replacements: { limit },
                type: sequelize.QueryTypes.SELECT,
            }
        );
        
        res.status(200).json({
            data: topSellers,
            total: topSellers.length,
            limit: limit,
        });
    } catch (error) {
        console.error('Error in getTopSeller:', error);
        res.status(500).json({
            message: error.message,
            error: error,
        });
    }
};

// [GET] /api/admin/statistic/userGrowth
const getUserGrowth = async (req, res) => {
    try {
        // Get the current year
        const currentYear = new Date().getFullYear() - 1;

        // Execute raw SQL to get user registrations by month
        const result = await sequelize.query(
            `
            WITH monthly_registrations AS (
                SELECT 
                    DATE_TRUNC('month', "createdAt") AS month,
                    COUNT(id) AS newUsers
                FROM "Users"
                WHERE EXTRACT(YEAR FROM "createdAt") = :currentYear
                GROUP BY DATE_TRUNC('month', "createdAt")
                ORDER BY DATE_TRUNC('month', "createdAt")
            )
            SELECT 
                TO_CHAR(month, 'Mon') AS month,
                newUsers
            FROM monthly_registrations
            ORDER BY month ASC;
            `,
            {
                replacements: { currentYear },
                type: sequelize.QueryTypes.SELECT,
            }
        );

        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const formattedData = monthNames.map((month, index) => {
            const monthData = result.find(item => item.month.toString() == month);
            return {
                month,
                newUsers: monthData ? parseInt(monthData.newusers) : 0,
            };
        });

        let totalUsers = 0;
        for (let i = 0; i < formattedData.length; i++) {
            totalUsers += parseInt(formattedData[i].newUsers);
        }
        
        res.status(200).json({
            data: formattedData,
            total_users: totalUsers,
        });
    } catch (error) {
        console.error('Error in getUserGrowth:', error);
        res.status(500).json({
            message: error.message,
        });
    }
};


module.exports = {
    getRecentOrders,
    getRecentCustomer,
    getTopSeller,
    getUserGrowth,
};
