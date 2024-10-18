const User = require('../model/User');
const jwt = require('jsonwebtoken');

const handleRefreshToken = async (req, res) => {
    const refreshToken = req.cookies ? req.cookies.refreshToken : null;

    if (!refreshToken) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const user = await User.findOne({ where: { refreshToken: refreshToken } });
    if (!user) {
        return res.status(403).json({ message: 'Forbidden' });
    }

    console.log('REFRESH_TOKEN_SECRET: ', process.env.REFRESH_TOKEN_SECRET);
    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, decoded) => {
            if (err) {
                return res.status(403).json({ message: 'Forbidden' });
            }

            const accessToken = jwt.sign(
                {
                    'id': decoded.id,
                    'role': user.role,
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '15m' }
            );

            res.json({ accessToken });
        }
    );
};

module.exports = { handleRefreshToken };