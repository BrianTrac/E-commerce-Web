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
        //{ expiresIn: '15m' }

        // TODO: Remember to change back to 15m
        { expiresIn: '1h' }  // 1 hour - to avoid lose time when testing on Postman  
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