const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Product = sequelize.define('Product', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    images: {
        type: DataTypes.JSONB,
        allowNull: false,
    },
    category_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    rating: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    discount_rate: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0,
    },
    original_price: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    status: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    short_description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    thumbnail_url: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    quantity_sold: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
    },
    specifications: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    current_seller: {
        type: DataTypes.JSONB,
        allowNull: false,
    },
    created_at: {
        type: DataTypes.DATE,
        allowNull: true,
    },
}, {
    tableName: 'product',
    timestamps: true,
});

module.exports = Product;