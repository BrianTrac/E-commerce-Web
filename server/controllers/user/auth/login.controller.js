const User = require('../../../models/User');
const bcrypt = require('bcrypt');
const { generateAccessToken, generateRefreshToken } = require('../../../utils/jwtToken');

const handleLogin = async (req, res) => {
    const { username, password } = req.body;
    //    console.log('req.body: ', req.body);
    if (!username || !password) {
        return res.status(400).json({ message: 'incorrect form submission' });
    }

    const user = await User.findOne({
        where: {
            username: username
        }
    });

    if (!user) {
        return res.status(401).json({ message: 'invalid credentials' });
    }
    if (user.is_active == false) {
        return res.status(401).json({ message: 'Your account is deactivated by admin' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
        return res.status(401).json({ message: 'invalid credentials' });
    }

    const accessToken = generateAccessToken(user);

    const refreshToken = generateRefreshToken(user);

    user.refreshToken = refreshToken;
    await user.save();

    // Store the refresh token in an HTTP-only cookie
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'None',
    });

    res.json({ accessToken: accessToken });
};

module.exports = { handleLogin };