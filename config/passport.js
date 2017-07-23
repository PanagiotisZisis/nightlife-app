'use strict';

const FacebookStrategy = require('passport-facebook').Strategy;
const User = require('../models/users');
const mongoose = require('mongoose');

module.exports = (passport) => {
  passport.serializeUser((user, done) => {
  done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user);
    });
  });

  passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_CLIENT_ID,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    callbackURL: 'https://enigmatic-forest-46409.herokuapp.com/auth/facebook/callback'
  }, 
  (token, refreshToken, profile, done) => {
    mongoose.Types.ObjectId.isValid(profile.id);
    process.nextTick(() => {
      User.findOne({ facebookID : profile.id }, (err, user) => {
        if (err) return done(err);
        if (user) {
          done(null, user);
        } else {
          const newUser = new User();
          newUser.facebookID = profile.id;
          newUser.facebookToken = token;
          newUser.facebookName = profile.displayName;

          newUser.save((err) => {
            if (err) throw err;
            return done(null, user);
          });
        }
      });
    });
  }));
};