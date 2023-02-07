const passport = require('passport');
const JWTStrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
const User = require('../models/users');

let opts = {
    jwtFromRequest : ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey : 'codial' 
}


passport.use(new JWTStrategy(opts, function(JwtPayload, done){
    User.findById(JwtPayload._id, function(err, user){
        if(err){
            console.log('error in finding user form JWT ');
            return;
        }
        if(user){
            return done(null, user);
        }else {
            return done(null, false);
        }
    })
}));


module.exports = passport;