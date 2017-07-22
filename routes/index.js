'use strict';

const express = require('express');
const router = express.Router();
const yelp = require('yelp-fusion');
const passport = require('passport');
const Location = require('../models/locations');

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

router.post('/', (req, res) => {
  const locationID = req.body.locationID;
  const userID = req.body.userID;
  const newLocation = new Location({
    locationID: locationID,
    usersID: [userID]
  });

  Location.findOne({ locationID: locationID }, (err, doc) => {
    if (err) throw err;
    if (!doc) {
      newLocation.save(err => {
        if (err) throw err;
        res.json({ ajax: 'new location saved' });
      });
    } else {
      let docUsersID = doc.usersID;
      if (docUsersID.indexOf(userID) === -1) {
        docUsersID.push(userID);
        const updatedDoc = {
          usersID: docUsersID
        };

        Location.update({ locationID: locationID }, updatedDoc, err => {
          if (err) throw err;
          res.json({ ajax: 'successful ++'});
        });
      } else {
        const index = docUsersID.indexOf(userID);
        docUsersID.splice(index, 1);
        const updatedDoc = {
          usersID: docUsersID
        };

        Location.update({ locationID: locationID }, updatedDoc, err => {
          if (err) throw err;
          res.json({ ajax: 'successful --'});
        });
      }
    }
  });
});

module.exports = router;
