const User = require('../model/User');
const {generateAccessToken} = require('../helper/jwtToken');    

const handleRefreshToken = async (req, res) => {
    const refreshToken = req.cookies ? req.cookies.refreshToken : null;

    if (!refreshToken) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const user = await User.findOne({ where: { refreshToken: refreshToken } });
    if (!user) {
        return res.status(403).json({ message: 'Forbidden' });
    }

//    console.log('REFRESH_TOKEN_SECRET: ', process.env.REFRESH_TOKEN_SECRET);
    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, decoded) => {
            if (err) {
                return res.status(403).json({ message: 'Forbidden' });
            }

            const accessToken = generateAccessToken(user);

            res.json({ accessToken });
        }
    );
};

module.exports = { handleRefreshToken };