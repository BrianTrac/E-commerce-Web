const User = require('./User'); // Import User model
const OTP = require('./OTP'); // Import OTP model

// Define associations
User.hasMany(OTP, {
    foreignKey: 'userId',
    as: 'otps',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});

OTP.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});
