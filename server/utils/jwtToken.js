const jwt = require('jsonwebtoken');

const generateAccessToken = (user) => {
    return jwt.sign(
        {
            id: user.id,
            role: user.role,
            username: user.username,
            email: user.email,
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '15m' }
    );
};

const generateRefreshToken = (user) => {
    return jwt.sign(
        {
            id: user.id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '30d' }
    );
};

module.exports = {
    generateAccessToken,
    generateRefreshToken,
};