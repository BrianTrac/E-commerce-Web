const User = require('../../../models/User');
const jwt = require('jsonwebtoken');
const {generateAccessToken} = require('../../../utils/jwtToken');    

const handleRefreshToken = async (req, res) => {
    const refreshToken = req.cookies ? req.cookies.refreshToken : null;
//    console.log('REFRESH_TOKEN: ', refreshToken);

    if (!refreshToken) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const user = await User.findOne({ where: { refreshToken: refreshToken } });
//    console.log('USER: ', user);
    if (!user) {
        return res.status(403).json({ message: 'Forbidden' });
    }

//    console.log('REFRESH_TOKEN_SECRET: ', process.env.REFRESH_TOKEN_SECRET);
    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, decoded) => {
            if (err) {
                console.error('Error verifying refresh token:', err);
                return res.status(403).json({ message: 'Forbidden' });
            }

            const accessToken = generateAccessToken(user);

            res.json({ accessToken });
        }
    );
};

module.exports = { handleRefreshToken };