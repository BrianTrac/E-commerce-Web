const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Kết nối với cơ sở dữ liệu

// Định nghĩa Model Product
const Seller = sequelize.define('Seller', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    avg_rating_point: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    icon: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    info: {
        type: DataTypes.JSONB,
        allowNull: false,
    },
    review_count: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    store_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    total_follower: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    url: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    is_official: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
    },
}, {
    tableName: 'seller', 
    timestamps: true,
});

module.exports = Seller;
