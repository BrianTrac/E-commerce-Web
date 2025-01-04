const Sequelize = require('sequelize');
const Order = require('../../models/Order');
const OrderItems = require('../../models/OrderItems');
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
          model: OrderItems,
          as: 'orderItems',
          attributes: ['id', 'order_id', 'product_id', 'quantity', 'price', 'created_at', 'updated_at'],
          include: [
            {
              model: Product,
              as: 'product',
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
          as: 'user',
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
      attributes: ['id', 'user_id', 'status', 'created_at', 'updated_at', 'shipping_address', 'payment_method', 'total_amount'],
      include: [
        {
          model: OrderItems,
          as: 'orderItems',
          attributes: ['id', 'order_id', 'product_id', 'quantity', 'price', 'created_at', 'updated_at'],
          include: [
            {
              model: Product,
              as: 'product',
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
          as: 'user',
          attributes: ['id', 'username', 'email'],
        },
      ],
      order: [['created_at', 'DESC']], // Sắp xếp theo created_at giảm dần
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
      attributes: ['id', 'user_id', 'status', 'created_at', 'updated_at', 'total_amount'],
      include: [
        {
          model: OrderItems,
          as: 'orderItems',
          attributes: ['id', 'order_id', 'product_id', 'quantity', 'price', 'created_at', 'updated_at'],
          include: [
            {
              model: Product,
              as: 'product',
              attributes: [],
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
          as: 'user',
          attributes: ['id', 'username', 'email'],
        },
      ],
      where : {
        status: 'shipped',  //shipped
      },
    });

    if (!orders.length) {
      return res.status(404).json({ message: 'No orders found for this store' });
    }

    //console.log(orders);

    const groupedUsers = orders.reduce((acc, order) => {
      const userId = order.user_id;
    
      // Tính tổng spending của từng order
      const orderTotal = order.orderItems.reduce((total, item) => {
        return total + parseFloat(item.price) * item.quantity;
      }, 0);
    
      // Gộp theo user_id
      if (!acc[userId]) {
        acc[userId] = {
          userId: userId,
          username: order.user.username,
          email: order.user.email,
          totalSpending: 0,
          orders: []
        };
      }
    
      acc[userId].totalSpending += orderTotal;
      acc[userId].orders.push({
        orderId: order.id,
        spending: orderTotal,
        createdAt: order.created_at,
        updatedAt: order.updated_at
      });
    
      return acc;
    }, {});
    
    // Chuyển từ object sang array nếu cần
    const result = Object.values(groupedUsers);
    
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


const getMonthlyRevenue = async (req, res) => {
  try {
    const sellerId = req.user.id;
    const selectedYear = req.query.year ? parseInt(req.query.year, 10) : new Date().getFullYear();

    const seller = await Seller.findOne({
      where: { user_id: sellerId },
      attributes: ['store_id'],
    });

    if (!seller) {
      return res.status(404).json({ message: 'Seller not found' });
    }

    const storeId = seller.store_id;

    const orders = await Order.findAll({
      attributes: ['status', 'created_at', 'updated_at', 'total_amount'],
      include: [
        {
          model: OrderItems,
          as: 'orderItems',
          attributes: ['price', 'quantity'],
          include: [
            {
              model: Product,
              as: 'product',
              attributes: [],
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
      ],
      where : {
        status: 'shipped',  //
      },
    });

    if (!orders.length) {
      return res.status(404).json({ message: 'No data found for this store' });
    }

    const result = orders.map((order) => {
      const createdAt = new Date(order.created_at); // Lấy ngày từ order
      // Kiểm tra năm
      const spending =
        !isNaN(createdAt) && createdAt.getFullYear() === selectedYear
          ? order.orderItems.reduce((total, item) => total + item.price * item.quantity, 0)
          : 0;
    
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
      year: selectedYear,
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

