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
    callbackURL: 'api/auth/google/callback'
}, async (accessToken, refreshToken, profile, done) => {
    try {
        let user = await User.findOne({ where: { googleId: profile.id } });

        if (!user) {
            // check if user already exists by email
            user = await User.findOne({where : { email: profile.emails[0].value }});
            if (user) {
                user.googleId = profile.id;
                await user.save();
            } else {
                user = await User.create({
                    googleId: profile.id,
                    email: profile.emails[0].value,
                    username: profile.displayName,
                    role: 'User',
                    password: await bcrypt.hash(crypto.randomBytes(20).toString('hex'), 10)
                });

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
