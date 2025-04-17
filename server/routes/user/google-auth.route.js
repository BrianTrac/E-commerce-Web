const express = require('express');
const passport = require('../../services/passport-setup.service');
const router = express.Router();
const { WEB_URL } = require('../../config/config');
const { generateAccessToken, generateRefreshToken } = require('../../utils/jwtToken');

// Google OAuth login route
router.get('/', (req, res, next) => {
    const { type } = req.query;
    
    passport.authenticate('google', {
        scope: ['profile', 'email'],
        state: JSON.stringify({ type: type || 'user' })
    })(req, res, next);
});

// Google OAuth callback route
router.get('/callback', passport.authenticate('google',{failureRedirect: `${WEB_URL}/auth/login`}),
    async (req, res) => {
        const accessToken = generateAccessToken(req.user);
        const refreshToken = generateRefreshToken(req.user);
        const redirectURL = `${WEB_URL}/auth/google/callback?accessToken=${accessToken}`;

        req.user.refreshToken = refreshToken;
        console.log('User_2:', req.user); // Log the user to see if it's being found correctly
        console.log('Refresh Token:', refreshToken); // Log the refresh token to see if it's being generated correctly

        try {
            await req.user.save();
            res.cookie('refreshToken', refreshToken,
                {
                    httpOnly: true,
                    sameSite: 'none',
                    secure: true
                }
            );
            console.log('Redirect URL:', redirectURL);
            res.redirect(redirectURL);
        } catch (error) {
            console.error('Error saving user:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
);

module.exports = router;