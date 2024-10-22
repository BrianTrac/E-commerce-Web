const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const OTP = sequelize.define('OTP', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: true, // Allow NULL since OTP might not always be linked to a User
        references: {
            model: 'Users', // Reference to the Users table
            key: 'id'
        }, 
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE', 
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    purpose: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    otp: {
        type: DataTypes.STRING,
        allowNull: false,
    },  
    expiresAt: {
        type: DataTypes.DATE,
        allowNull: false,
    },
}, {
    tableName: 'OTPs',
    timestamps: true,
});

module.exports = OTP;
