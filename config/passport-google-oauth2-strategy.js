const passport = require('passport');
const googleStrategy = require('passport-google-oauth').OAuth2Strategy;
const crypto = require('crypto');
const User = require('../models/users');


// using google auth login strategy
passport.use(new googleStrategy({
    clientID : "12793660445-13ora57thin4ujjoc440vkvtpd8hajvc.apps.googleusercontent.com",
    clientSecret : "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",
    callbackURL : "http://localhost:8000/users/auth/google/callback"
    },
    function(accessToken, refreshToken, profile, done){
        User.findOne({email : profile.emails[0].value}).exec(function(err, user){
            if(err){
                console.log('Error in google strategy passport', err);
                return;
            }
            console.log(profile);
            if(user){
                return done(null, user);
            }else {
                User.create({
                    name : profile.displayName,
                    email : profile.emails[0].value,
                    password : crypto.randomBytes(20).toString('hex')
                }, (err, user) => {
                    if(err){
                        console.log('Error in creating user');
                        return;
                    }
                    return done(null, user);
                });
            }
        })
    }
));

module.exports = passport;