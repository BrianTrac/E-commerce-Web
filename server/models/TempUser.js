const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const TempUser = sequelize.define('TempUser', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    otp: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    role: {
        type: DataTypes.ENUM('User', 'Admin', 'Seller'),
        defaultValue: 'user',
    },
}, {
    tableName: 'TempUsers',
    timestamps: true,
});

module.exports = TempUser;