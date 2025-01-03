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
      attributes: ['id', 'user_id', 'status', 'created_at', 'updated_at', 'shipping_address', 'payment_method', 'total_amount'],
      include: [
        {
          model: OrderItem,
          attributes: ['id', 'order_id', 'product_id', 'quantity', 'price', 'created_at', 'updated_at'],
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

const getPotentialCustomer = async (req, res) => {
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
                    Sequelize.cast(Sequelize.json('current_seller.store_id'), 'INTEGER'), storeId
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

    const result = orders.map((order) => {
      const spending = order.OrderItems.reduce((total, item) => {
        return total + item.price * item.quantity;
      }, 0);
    
      return {
        id: order.id,
        userId: order.user_id,
        username: order.User?.username || 'N/A',
        email: order.User?.email || 'N/A',
        status: order.status,
        spending,
        createdAt: order.created_at,
        updatedAt: order.updated_at,
      };
    });
    
    // Trả về kết quả
    res.status(200).json({
      message: 'Orders with spending fetched successfully',
      data: result,
    });
  } catch (error) {
    console.error('Error fetching potential customers:', error.message);
    res.status(500).json({
      message: 'Internal server error',
      error: error.message,
    });
  }
};

const getRecentOrders = async (req, res) => {
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
      order: [['created_at', 'DESC']], // Sắp xếp theo created_at giảm dần
    });

    if (!orders.length) {
      return res.status(404).json({ message: 'No orders found for this store' });
    }

    res.status(200).json({
      message: 'Recent orders fetched successfully',
      orders,
    });
  } catch (error) {
    console.error('Error fetching recent orders:', error.message);
    res.status(500).json({
      message: 'Internal server error',
      error: error.message,
    });
  }
};


const getMonthlyRevenue = async (req, res) => {
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
      attributes: ['id', 'created_at', 'updated_at'],
      include: [
        {
          model: OrderItem,
          attributes: ['quantity', 'price', 'created_at'],
          include: [
            {
              model: Product,
              as: 'Product',
              attributes: [],
              where: {
                [Op.and]: [
                  Sequelize.where(
                    Sequelize.cast(Sequelize.json('current_seller.store_id'), 'INTEGER'), storeId
                  )
                ],
              },
              required: true, 
            },
          ],
          required: true, 
        },
      ],

    });

    if (!orders.length) {
      return res.status(404).json({ message: 'No data found for this store' });
    }

    const result = orders.map((order) => {
      const spending = order.OrderItems.reduce((total, item) => {
        const currentYear = new Date().getFullYear();
        const createdAt = new Date(item.dataValues.created_at);

        if (!isNaN(createdAt) && createdAt.getFullYear() === currentYear) {  // Check if the order is from this year
          return total + item.price * item.quantity;
        }
        return total;
      }, 0);
      return {
        spending,
        createdAt: order.created_at,
        updatedAt: order.updated_at,
      };
    });

    const getMonthName = (date) => {
      const monthNames = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
      ];
      const monthIndex = new Date(date).getMonth();
      return monthNames[monthIndex];
    };
    
    // Function to transform the data
    const transformData = (data) => {
      const monthlyData = {};
    
      // Loop through each entry and aggregate spending by month
      data.forEach((entry) => {
        const month = getMonthName(entry.createdAt);
        if (!monthlyData[month]) {
          monthlyData[month] = 0;
        }
        monthlyData[month] += entry.spending;
      });
    
      // Ensure all months are represented, even with zero spending
      const allMonths = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
      ];
      
      return allMonths.map((month) => ({
        month: month,
        value: monthlyData[month] || 0
      }));
    };
    
    // Transform the data
    const formattedData = transformData(result);


    res.status(200).json({
      message: 'Monthly revenue fetched successfully',
      data: formattedData,
    });

  } catch (error) {
    console.error('Error fetching monthly revenue:', error.message);
    res.status(500).json({
      message: 'Internal server error',
      error: error.message,
    });
  }
};


module.exports = {
  getOrders,
  updateOrderStatus,
  getPotentialCustomer,
  getRecentOrders,
  getMonthlyRevenue,
};

