const User = require('../../../models/User');
const bcrypt = require('bcrypt');
const { generateAccessToken, generateRefreshToken } = require('../../../utils/jwtToken');

const handleLogin = async (req, res) => {
    const { username, password, type } = req.body;
    //    console.log('req.body: ', req.body);
    if (!username || !password || !type) {
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

    if (typeof type !== 'string' || typeof user.role !== 'string') {
        return res.status(400).json({ message: 'invalid credentials' });
    }
    
    if (type.trim().toLowerCase() !== user.role.trim().toLowerCase()) {
        return res.status(401).json({ message: 'invalid credentials' });
    }
        
    // check the user type
    if (type.toLowerCase() !== user.role.toLowerCase()) {
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

    return res.json({ accessToken: accessToken });
};

module.exports = { handleLogin };