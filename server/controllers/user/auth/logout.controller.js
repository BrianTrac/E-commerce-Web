const User = require('../../../models/User');

const handleLogout = async (req, res) => {
    const refreshToken = req.cookies ? req.cookies.refreshToken : null;

    if (!refreshToken) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const user = await User.findOne({ where: { refreshToken: refreshToken } });   
    if (!user) {
        res.clearCookie('refreshToken',
            {
                httpOnly: true,
                sameSite: 'none',
                secure: true
            }
        );
        return res.status(204).json({ message: 'No content' });
        
    }

    user.refreshToken = null;
    await user.save();

    res.clearCookie('refreshToken',
        {
            httpOnly: true,
            sameSite: 'none',
            secure: true
        }
    );

    res.status(204).json({ message: 'No content' });
};

module.exports = { handleLogout };