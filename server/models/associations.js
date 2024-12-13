const User = require('./User'); // Import User model
const OTP = require('./OTP'); // Import OTP model

const Product = require('./Product'); // Import Product model
const Category = require('./Category'); // Import Category model

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