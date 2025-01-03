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
    url_key: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    short_description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    images: {
        type: DataTypes.JSONB,
        allowNull: false,
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
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    price: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    rating_average: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    discount_rate: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    inventory_status: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
            isIn: [['available', 'pending', 'suspend']],
        }
    },
    thumbnail_url: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    video_url: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    qty: {
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
        type: DataTypes.JSONB,
        allowNull: true,
    },
    current_seller: {
        type: DataTypes.JSONB,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
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