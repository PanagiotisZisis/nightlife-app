'use strict';

const express = require('express');
const router = express.Router();
const yelp = require('yelp-fusion');
const passport = require('passport');

router.get('/', (req, res) => {
  console.log(req.user);
  if (req.user) {
    return res.render('index', { location: false, bars: false , user: req.user, error: false });
  }
  res.render('index', { location: false, bars: false , user: false, error: false });
});

router.post('/', (req, res) => {
  const location = req.body.location;
  
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
      res.render('index', { location: location, bars: response.jsonBody.businesses, user: false, error: false });
    }).catch(() => {
      if (req.user) {
        return res.render('index', { location: false, bars: false , user: req.user, error: 'Invalid Search Term' });
      }
      res.render('index', { location: false, bars: false , user: false, error: 'Invalid Search Term' });
    });
  });
});

router.get('/auth/facebook', passport.authenticate('facebook'));

router.get('/auth/facebook/callback', passport.authenticate('facebook', {
  successRedirect: '/',
  failureRedirect: '/'
}));

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

module.exports = router;
