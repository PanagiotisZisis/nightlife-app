'use strict';

const express = require('express');
const router = express.Router();
const yelp = require('yelp-fusion');
const passport = require('passport');

router.get('/', (req, res) => {
  console.log(req.user);
  if (!req.query.location) {
    if (req.user) {
      return res.render('index', { location: false, bars: false , user: req.user, error: false });
    }
    res.render('index', { location: false, bars: false , user: false, error: false });
  } else {
    const location = req.query.location;

    yelp.accessToken(process.env.YELP_CLIENT_ID, process.env.YELP_CLIENT_SECRET).then(response => {
      const client = yelp.client(response.jsonBody.access_token);

      client.search({
        term: 'Nightlife',
        categories: 'bars',
        location: location
      }).then(response => {
        if (req.user) {
          return res.render('index', { location: location, bars: response.jsonBody.businesses, user: req.user, error: false });
        }
        res.cookie('location', location);
        res.render('index', { location: location, bars: response.jsonBody.businesses, user: false, error: false });
      }).catch(() => {
        if (req.user) {
          return res.render('index', { location: false, bars: false , user: req.user, error: 'There was an error - please try again.' });
        }
        res.cookie('location', location);
        res.render('index', { location: false, bars: false , user: false, error: 'There was an error - please try again.' });
      });
    });
  }
});

router.get('/auth/facebook', passport.authenticate('facebook'));

router.get('/auth/facebook/callback', (req, res, next) => {
  passport.authenticate('facebook', (err, user) => {
    if (err) { return next(err); }
    if (!user) { return res.redirect('/?location=' + req.cookies.location); }
    req.logIn(user, (err) => {
      if (err) { return next(err); }
      return res.redirect('/?location=' + req.cookies.location);
    });
  })(req, res, next);
});

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

module.exports = router;
