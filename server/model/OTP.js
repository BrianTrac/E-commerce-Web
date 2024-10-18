const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const OTP = sequelize.define('OTP', {
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    email: {
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
    timestamps: true,
});

module.exports = OTP;
