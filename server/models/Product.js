const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Product = sequelize.define('product', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    url_key: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    images: {
        type: DataTypes.JSONB,
        allowNull: false,
    },
    short_description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    category_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    category_name: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    original_price: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    price: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    rating_average: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0,
    },
    discount_rate: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    inventory_status: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    thumbnail_url: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    video_url: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    specifications: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    quantity_sold: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
    },
    qty: {
        type: DataTypes.INTEGER,
        allowNull: false,
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
    timestamps: false,
});

module.exports = Product;