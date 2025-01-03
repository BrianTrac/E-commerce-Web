// models/OrderItem.js
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Đường dẫn đến file cấu hình Sequelize

class OrderItem extends Model {}

OrderItem.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        order_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        product_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        price: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        created_at: {
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue: DataTypes.NOW,
        },
        updated_at: {
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue: null,
        },
    },
    {
        tableName: 'order_items',
        sequelize,
        modelName: 'OrderItem',
        underscored: true,
    }
);

module.exports = OrderItem;