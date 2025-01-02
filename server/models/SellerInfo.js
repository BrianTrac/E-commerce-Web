const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const SellerInfo = sequelize.define('SellerInfo', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  store_id: {
    type: DataTypes.INTEGER,
    allowNull: true, 
  },
  phone: {
    type: DataTypes.TEXT,  
    allowNull: true,  
  },
  address: {
    type: DataTypes.TEXT,
    allowNull: true, 
  },
  working_time: {
    type: DataTypes.TEXT,
    allowNull: true,  
  },
  payment_info: {
    type: DataTypes.TEXT,  
    allowNull: true,  
  },
  logo: {
    type: DataTypes.TEXT,  
    allowNull: true,  
  },
  description: {
    type: DataTypes.TEXT,  
    allowNull: true, 
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  }
}, {
  tableName: 'seller_info',
  timestamps: true,
});


module.exports = SellerInfo;
