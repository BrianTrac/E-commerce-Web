const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const User = require('../models/User');
const passport = require('passport');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

// Google Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.NODE_ENV === 'production' 
  ? 'https://e-commerce-web-production.up.railway.app/api/auth/google/callback'
  : 'http://localhost:5000/api/auth/google/callback',
    passReqToCallback: true, // allows us to pass the req from our route (check if a user is logged in)
}, async (req, accessToken, refreshToken, profile, done) => {
    try {

        const {type} = JSON.parse(req.query.state.toLowerCase() || '{}');
        console.log('Type:', type); // Log the type to see if it's being passed correctly;
        let user = await User.findOne({
            where: {
                googleId: profile.id, 
         } });

        console.log('User:', user); // Log the user to see if it's being found correctly
        if (!user) {
            // check if user already exists by email
            user = await User.findOne({where : { email: profile.emails[0].value }});
            if (user) {
                user.googleId = profile.id;
                await user.save();
            } else {
                const defaultRole = ((type.toLowerCase() === 'seller') ? 'Seller' : 'User');
                user = await User.create({
                    googleId: profile.id,
                    email: profile.emails[0].value,
                    username: profile.displayName,
                    role: defaultRole,
                    password: await bcrypt.hash(crypto.randomBytes(20).toString('hex'), 10)
                });

            }
        } else {
            // Validate the user type
            if (type && user.role.toLowerCase() !== type.toLowerCase()) {
                return done(null, false, { message: 'Role mismatch' });
            }
        }

        return done(null, user);
    } catch (err) {
        console.log(err);
        return done(err, null);
    }
}));

// Facebook Strategy
/*
passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_CLIENT_ID,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    callbackURL: 'api/auth/facebook/callback',
    profileFields: ['id', 'emails', 'name'] // Request these fields from Facebook
}, async (accessToken, refreshToken, profile, done) => {
    try {
        let user = await User.findOne({where: { facebookId: profile.id }});

        if (!user) {
            // check if user already exists by email
            user = await User.findOne({where : { email: profile.emails[0].value }});
            if (user) {
                user.facebookId = profile.id;
                await user.save();
            } else {
                user = await User.create({
                    facebookId: profile.id,
                    email: profile.emails[0].value,
                    name: `${profile.name.givenName} ${profile.name.familyName}`,
                    role: 'User',
                    password: await bcrypt.hash(crypto.randomBytes(20).toString('hex'), 10)
                });
            }
        }

        return done(null, user);
    } catch (err) {
        return done(err, null);
    }
}));
*/

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findByPk(id);
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});

module.exports = passport;
