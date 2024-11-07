const express = require('express');
const passport = require('passport');
const router = express.Router();
const { WEB_URL } = require('../../config/config');
const { generateAccessToken, generateRefreshToken } = require('../../utils/jwtToken');

// Facebook OAuth login route
router.get('/', passport.authenticate('facebook', {
    scope: ['email']
}));

// Facebook OAuth callback route
router.get('/callback', passport.authenticate('facebook', { failureRedirect: `${WEB_URL}/auth/login` }),
    async (req, res) => {
        const accessToken = generateAccessToken(req.user);
        const refreshToken = generateRefreshToken(req.user);

        req.user.refreshToken = refreshToken;

        try {
            await req.user.save();
            res.cookie('refreshToken', refreshToken,
                {
                    httpOnly: true,
                    sameSite: 'none',
                    secure: true
                }
            );
            res.redirect(`${WEB_URL}`);
        } catch (error) {
            console.error('Error saving user:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
);

module.exports = router;