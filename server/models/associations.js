const User = require('./User'); // Import User model
const OTP = require('./OTP'); // Import OTP model

const Product = require('./Product'); // Import Product model
const Category = require('./Category'); // Import Category model
const Cart = require('./Cart'); // Import Cart model
const CartItems = require('./CartItems'); // Import CartItems model

const Order = require('./Order'); // Import Order model
const OrderItems = require('./OrderItems'); // Import OrderItems model

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


// Define associations User - Cart (one-to-one)
User.hasOne(Cart, {
    foreignKey: 'user_id',
    as: 'cart',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});


Cart.belongsTo(User, {
    foreignKey: 'user_id',
    as: 'user',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});

// Define associations Cart - CartItems (one-to-many)
Cart.hasMany(CartItems, {
    foreignKey: 'cart_id',
    as: 'cartItems',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});

CartItems.belongsTo(Cart, {
    foreignKey: 'cart_id',
    as: 'cart',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});

// Define associations Product - CartItems (one-to-many)
Product.hasMany(CartItems, {
    foreignKey: 'product_id',
    as: 'cartItems',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});

CartItems.belongsTo(Product, {
    foreignKey: 'product_id',
    as: 'product',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});

// Define associations User - Order (one-to-many)
User.hasMany(Order, {
    foreignKey: 'user_id',
    as: 'orders',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});


Order.belongsTo(User, {
    foreignKey: 'user_id',
    as: 'user',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});

// Define associations Order - OrderItems (one-to-many)
Order.hasMany(OrderItems, {
    foreignKey: 'order_id',
    as: 'orderItems',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});

OrderItems.belongsTo(Order, {
    foreignKey: 'order_id',
    as: 'order',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});

// Define associations Product - OrderItems (one-to-many)
Product.hasMany(OrderItems, {
    foreignKey: 'product_id',
    as: 'orderItems',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});

OrderItems.belongsTo(Product, {
    foreignKey: 'product_id',
    as: 'product',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});



