const User = require('../model/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const handleLogin = async (req, res) => {
    const { username, password } = req.body;  
//    console.log('req.body: ', req.body);
    if (!username || !password) {
        return res.status(400).json('incorrect form submission');
    }

    const user = await User.findOne({
        where: {
            username: username 
        }
    });
    
    if (!user) {
        return res.status(401).json('invalid credentials');
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
        return res.status(401).json('invalid credentials');
    }

    const accessToken = jwt.sign(
        {
            'id': user.id,
            'role': user.role,
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
        {
            'id': user.id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '1m' }
    );

    user.refreshToken = refreshToken;
    await user.save();

    // Store the refresh token in an HTTP-only cookie
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true, 
        secure: true,
        sameSite: 'None',
    });

    res.json({ accessToken });
};

module.exports = { handleLogin };