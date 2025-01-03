const Product = require('../../models/Product');
const Order = require('../../models/Order');
const OrderItems = require('../../models/OrderItems');
const { QueryTypes, Op } = require('sequelize');
const sequelize = require('../../config/db');

// ?page=1&limit=10?status='pending'||'processing'||'cancelled'||'delivered'||''
const getOrders = async (req, res) => {
    const { status } = req.query;
    
    // convert to int
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    try {
        const orders = await Order.findAndCountAll({
            where: status ? { status } : {},
            order: [['createdAt', 'DESC']],
            offset,
            limit,
            include: [
                {
                    model: OrderItems,
                    as: 'orderItems',
                    include: [
                        {
                            model: Product,
                            as: 'product',
                            attributes: ['id', 'name', 'thumbnail_url'],
                        },
                    ],
                },
            ],
        });

        return res.json({
            success: true,
            message: 'Successfully fetched orders',
            data: orders,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

// get order by id

const getOrder = async (req, res) => {
    const { orderId } = req.params;

    try {
        const order = await Order.findByPk(orderId, {
            include: [
                {
                    model: OrderItems,
                    as: 'orderItems',
                    include: [
                        {
                            model: Product,
                            as: 'product',
                            attributes: ['id', 'name', 'thumbnail_url'],
                        },
                    ],
                },
            ],
        });

        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        return res.json({
            success: true,
            message: 'Successfully fetched order',
            data: order,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

// create order
const createOrder = async (req, res) => {
    const { orderItems, totalAmount, shippingAddress, paymentMethod } = req.body;
    console.log('totalAmount', totalAmount);

    try {
        const order = await sequelize.transaction(async (t) => {
            const newOrder = await Order.create(
                {
                    user_id: req.user.id,
                    total_amount: parseFloat(totalAmount),
                    shipping_address: shippingAddress,
                    payment_method: (paymentMethod === 'cash') ? paymentMethod  : 'card',
                    status: (paymentMethod === 'cash') ? 'processing' : 'pending',
                },
                { transaction: t }
            );

            const orderItemsData = orderItems.map((item) => ({
                order_id: newOrder.id,
                product_id: item.productId,
                quantity: item.quantity,
                price: item.price,
            }));

            await OrderItems.bulkCreate(orderItemsData, { transaction: t });

            return newOrder;
        });

        return res.json({
            success: true,
            message: 'Successfully created order',
            data: order,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

// update order ? status='pending'||'processing'||'cancelled'||'delivered' & ? shipping_address

const updateOrder = async (req, res) => {
    const { orderId } = req.params;
    const { status, shippingAddress } = req.body;

    try {
        const order = await Order.findByPk(orderId);

        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        if (status && !['pending', 'processing', 'cancelled', 'delivered'].includes(status)) {
            return res.status(400).json({ success: false, message: 'Invalid status' });
        }

        if (shippingAddress && typeof shippingAddress !== 'string') {
            return res.status(400).json({ success: false, message: 'Invalid shipping address' });
        }

        if (shippingAddress) {
            order.shipping_address = shippingAddress;
        }

        if (status) {
            order.status = status;
        }

        await order.save();

        return res.json({
            success: true,
            message: 'Successfully updated order',
            data: order,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

module.exports = {
    getOrders,
    getOrder,
    createOrder,
    updateOrder,
};



