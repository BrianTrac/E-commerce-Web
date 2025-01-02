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
        order_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
    {
        tableName: 'order_items',
        sequelize,
        modelName: 'OrderItem',
    }
);

module.exports = OrderItem;