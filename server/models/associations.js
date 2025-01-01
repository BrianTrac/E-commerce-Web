const User = require('./User'); // Import User model
const OTP = require('./OTP'); // Import OTP model

const Product = require('./Product'); // Import Product model
const Category = require('./Category'); // Import Category model

const Order = require('./Order'); // Import Order model
const OrderItem = require('./OrderItem'); // Import OrderItem model

// Define associations User - OTP (one-to-many)
User.hasMany(OTP, {
    foreignKey: 'userId',
    as: 'otps',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});

OTP.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});


// Define associations Category - Product (one-to-many)

Category.hasMany(Product, {
    foreignKey: 'category_id',
    as: 'products',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});

Product.belongsTo(Category, {
    foreignKey: 'category_id',
    as: 'category',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});

// // Define associations
// Order.hasMany(OrderItem, { foreignKey: 'id' });
// OrderItem.belongsTo(Order, { foreignKey: 'id' });

// // Define associations OrderItem - Product (many-to-one)
// OrderItem.belongsTo(Product, { foreignKey: 'id' });
// Product.hasMany(OrderItem, { foreignKey: 'id' });

// Define associations User - Order (one-to-many)
User.hasMany(Order, { foreignKey: 'id' });
Order.belongsTo(User, { foreignKey: 'id' });

Order.hasMany(OrderItem, { foreignKey: 'order_id'});
OrderItem.belongsTo(Order, { foreignKey: 'id'});

// OrderItem.belongsTo(Product, { foreignKey: 'id' });
// Product.hasMany(OrderItem, { foreignKey: 'id'});


// Định nghĩa quan hệ trong OrderItem.js
OrderItem.belongsTo(Product, { foreignKey: 'product_id', as: 'Product' });

// Định nghĩa quan hệ trong Product.js (nếu cần)
Product.hasMany(OrderItem, { foreignKey: 'product_id', as: 'OrderItems' });
