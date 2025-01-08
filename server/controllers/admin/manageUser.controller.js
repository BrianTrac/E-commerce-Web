const User = require('../../models/User');
const Product = require('../../models/Product');
const Order = require('../../models/Order');
const OrderItems = require('../../models/OrderItems');
const moment = require('moment');
const sequelize = require('../../config/db');
const { Op } = require('sequelize');

// [GET] /api/admin/user/
const getAllUser = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const search = req.query.search || '';

        const offset = (page - 1) * limit;

        const whereCondition = {
            role: 'User', // Ensure only users with role 'User' are retrieved
            ...(search && {
                [Op.or]: [
                    { username: { [Op.iLike]: `%${search}%` } },
                    { email: { [Op.iLike]: `%${search}%` } }
                ]
            })
        };

        // Get total count for pagination
        const totalCount = await User.count({
            where: whereCondition
        });

        // Get users with pagination and search
        const users = await User.findAll({
            where: whereCondition,
            order: [['createdAt', 'DESC']],
            limit: limit,
            offset: offset,
            attributes: [
                'id',
                'username',
                'email',
                'role',
                'createdAt',
                'updatedAt',
                'is_active',
            ]
        });

        // Format the createdAt date
        const formattedUsers = users.map(user => {
            console.log('Original createdAt:', user.createdAt); // Print the original createdAt date
            return {
                ...user.toJSON(),
                joinDate: moment(user.createdAt).format('YYYY-MM-DD')
            };
        });

        res.status(200).json({
            data: formattedUsers,
            total: totalCount,
            page: page,
            limit: limit
        });

    } catch (error) {
        console.error('Error in getAllUser:', error);
        res.status(500).json({
            message: error.message,
            error: error
        });
    }
};

// [GET] /api/admin/user/:id
const getOneUser = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findByPk(id, {
            attributes: [
                'id',
                'username',
                'email',
                'role',
                'createdAt',
                'updatedAt',
                'is_active',
            ]
        });

        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            });
        }

        res.status(200).json({
            data: user
        });

    } catch (error) {
        console.error('Error in getOneUser:', error);
        res.status(500).json({
            message: error.message,
            error: error
        });
    }
};

const getAllUserOrderList1 = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        const { id: userId } = req.params;

        // Verify user exists
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({
                message: 'User not found',
            });
        }

        // Query orders for the user
        const orders = await Order.findAll({
            where: { user_id: userId },
            attributes: ['id', 'user_id', 'total_amount', 'created_at', 'status'],
            include: [
                {
                    model: OrderItems,
                    attributes: [], // Không lấy thuộc tính từ OrderItems
                    include: [
                        {
                            model: Product,
                            attributes: [
                                'id',
                                'name',
                                'url_key',
                                'images',
                                'category_name',
                                'price',
                                'discount_rate',
                                'inventory_status',
                                'current_seller',
                            ],
                        },
                    ],
                },
            ],
            offset: offset,
            limit: limit,
        });

        // Count total orders for the user
        const totalCount = await Order.count({
            where: { user_id: userId },
        });

        return res.status(200).json({
            data: orders,
            total: totalCount,
            page: page,
            limit: limit,
        });
    } catch (error) {
        console.error('Error in getAllUserOrderList:', error);
        res.status(500).json({
            message: error.message,
            error: error,
        });
    }
};

// [GET] /api/admin/user/:id/products
const getAllUserOrderList = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        const { id: userId } = req.params;
        console.log('Original createdAt:', userId);

        // Verify user exists
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({
                message: 'User not found',
            });
        }

        const orders = await Order.findAll({
            where: { user_id: userId },
            attributes: ['id', 'user_id', 'total_amount', 'created_at', 'status'],
            include: [
                {
                    model: OrderItems,
                    as: 'orderItems',
                    attributes: [
                        'id',
                        'order_id',
                        'product_id',
                        'quantity',
                        'price',
                        'created_at'
                    ],
                    include: [
                        {
                            model: Product,
                            as: 'product', // Alias khớp với định nghĩa quan hệ
                            attributes: [
                                'id',
                                'name',
                                'url_key',
                                'images',
                                'category_name',
                                'price',
                                'discount_rate',
                                'inventory_status',
                                'current_seller',
                                'thumbnail_url',
                            ]
                        }
                    ]
                }
            ],
            offset: offset,
            limit: limit,
        });
        

        // Count total orders for the user
        const totalCount = await Order.count({
            where: { user_id: userId },
        });

        return res.status(200).json({
            data: orders,
            total: totalCount,
            page: page,
            limit: limit,
        });
    } catch (error) {
        console.error('Error in getAllUserOrderList:', error);
        res.status(500).json({
            message: error.message,
            error: error,
        });
    }
};

const activateUser = async (req, res) => {
    const user_id = req.params.id;
    try {
        const user = await User.findByPk(user_id);
        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            });
        }
        user.is_active = true;
        await user.save();
        res.status(200).json({
            message: 'Activated user successfully',
            data: user
        });
    } catch (error) {
        console.error('Error in activateUser:', error);
        res.status(500).json({
            message: error.message,
            error: error
        });
    }
};

// [PUT] /api/admin/user/:id/deactivate
const deactivateUser = async (req, res) => {
    const user_id = req.params.id;
    try {
        const user = await User.findByPk(user_id);
        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            });
        }
        user.is_active = false;
        await user.save();
        res.status(200).json({
            message: 'Deactivated user successfully',
            data: user
        });
    } catch (error) {
        console.error('Error in deactivateUser:', error);
        res.status(500).json({
            message: error.message,
            error: error
        });
    }
};

// [GET] /api/admin/user/:id/total-spent
const getUserTotalSpent = async (req, res) => {
    const { id: userId } = req.params;

    try {
        // Verify user exists
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({
                message: 'User not found',
            });
        }

        // Query total spent by the user
        const result = await Order.findOne({
            where: { user_id: userId },
            attributes: [
                [sequelize.fn('SUM', sequelize.col('total_amount')), 'total_spent'],
                [sequelize.fn('COUNT', sequelize.col('id')), 'order_count'],
            ],
        });

        // Check if any orders exist
        if (!result || !result.dataValues.total_spent) {
            return res.status(200).json({
                data: {
                    user_id: userId,
                    total_spent: 0,
                    order_count: 0,
                },
            });
        }

        return res.status(200).json({
            data: {
                user_id: userId,
                total_spent: result.dataValues.total_spent,
                order_count: result.dataValues.order_count,
            },
        });
    } catch (error) {
        console.error('Error in getUserTotalSpent:', error);
        res.status(500).json({
            message: error.message,
            error: error,
        });
    }
};

module.exports = {
    getAllUser,
    getOneUser,
    getAllUserOrderList,
    activateUser,
    deactivateUser,
    getUserTotalSpent,
};
