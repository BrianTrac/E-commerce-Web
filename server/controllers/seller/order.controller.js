const Sequelize = require('sequelize');
const Order = require('../../models/Order');
const OrderItem = require('../../models/OrderItem');
const Product = require('../../models/Product');
const Seller = require('../../models/Seller');
const User = require('../../models/User');
const { Op } = Sequelize;

const getOrders = async (req, res) => {
  try {
    const sellerId = req.user.id;

    const seller = await Seller.findOne({
      where: { user_id: sellerId },
      attributes: ['store_id'],
    });

    if (!seller) {
      return res.status(404).json({ message: 'Seller not found' });
    }

    const storeId = seller.store_id;

    const orders = await Order.findAll({
      attributes: ['id', 'user_id', 'total_price', 'status', 'created_at', 'updated_at'],
      include: [
        {
          model: OrderItem,
          attributes: ['id', 'order_id', 'product_id', 'quantity', 'price', 'created_at'],
          include: [
            {
              model: Product,
              as: 'Product',
              attributes: ['id', 'name', 'price', 'current_seller', 'thumbnail_url'],
              where: {
                [Op.and]: [
                  Sequelize.where(
                    Sequelize.cast(Sequelize.json('current_seller.store_id'), 'INTEGER'),
                    storeId
                  )
                ],
              },
              required: true, // Chỉ lấy các OrderItem có Product phù hợp
            },
          ],
          required: true, // Chỉ lấy các Order có OrderItem phù hợp
        },
        {
          model: User,
          attributes: ['id', 'username', 'email'],
        },
      ],
    });

    if (!orders.length) {
      return res.status(404).json({ message: 'No orders found for this store' });
    }

    res.status(200).json({
      message: 'Orders fetched successfully',
      orders,
    });
  } catch (error) {
    console.error('Error fetching orders:', error.message);
    res.status(500).json({
      message: 'Internal server error',
      error: error.message,
    });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params; // Ensure orderId is passed in params
    const { status } = req.body; // Ensure status is provided in request body

    // Find order by ID
    const order = await Order.findByPk(orderId);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Update status
    order.status = status;
    await order.save();

    res.status(200).json({ message: 'Order status updated successfully', order });
  } catch (error) {
    console.error('Error updating order status:', error.message);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

module.exports = {
  getOrders,
  updateOrderStatus,
};
