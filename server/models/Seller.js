const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Seller = sequelize.define('Seller', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    avg_rating_point: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    icon: {
        type: DataTypes.TEXT,
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
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    }
}, {
    tableName: 'seller',
    timestamps: false,
});

module.exports = Seller;
