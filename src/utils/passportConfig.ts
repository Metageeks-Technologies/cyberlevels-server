import passport from 'passport'
import { Strategy as LinkedInStrategy } from 'passport-linkedin-oauth2';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import dotenv from 'dotenv';
dotenv.config()

passport.serializeUser(function (user, cb) {
    cb(null, user);
});

passport.deserializeUser(function (obj, cb) {
    cb(null, obj as any);
});

passport.use(new LinkedInStrategy({
    clientID: process.env.CLIENT_ID || "",
    clientSecret: process.env.CLIENT_SECRET || "",
    callbackURL: process.env.CALLBACK_URL || "",
    scope: ['openid', 'profile', 'email'],

}, function (token, tokenSecret, profile, done) {
    return done(null, profile);

}));

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID || "",
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    callbackURL: process.env.GOOGLE_CALLBACK_URL || "",
    scope: ['openid', 'profile', 'email'],

}, function (token, tokenSecret, profile, done) {
    return done(null, profile);
}));

export default passport
