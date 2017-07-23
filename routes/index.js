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
      return res.render('index', { location: false, bars: false , user: req.user, error: false, locationdb: false });
    }
    res.render('index', { location: false, bars: false , user: false, error: false, locationdb: false });
  } else {
    const location = req.query.location;

    yelp.accessToken(process.env.YELP_CLIENT_ID, process.env.YELP_CLIENT_SECRET).then(response => {
      const client = yelp.client(response.jsonBody.access_token);

      client.search({
        term: 'Nightlife',
        categories: 'bars',
        location: location
      }).then(response => {
        Location.find((err, docs) => {
          if (err) throw err;
          if (!docs || docs.length === 0) {
            if (req.user) {
              return res.render('index', { location: location, bars: response.jsonBody.businesses, user: req.user, error: false, locationdb: false });
            }
            res.cookie('location', location);
            res.render('index', { location: location, bars: response.jsonBody.businesses, user: false, error: false, locationdb: false });
          } else {
            if (req.user) {
              return res.render('index', { location: location, bars: response.jsonBody.businesses, user: req.user, error: false, locationdb: docs });
            }
            res.cookie('location', location);
            res.render('index', { location: location, bars: response.jsonBody.businesses, user: false, error: false, locationdb: docs });
          }
        });
      }).catch(() => {
        if (req.user) {
          return res.render('index', { location: false, bars: false , user: req.user, error: 'There was an error - please try again.', locationdb: false });
        }
        res.cookie('location', location);
        res.render('index', { location: false, bars: false , user: false, error: 'There was an error - please try again.', locationdb: false });
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

  // creating new location
  Location.findOne({ locationID: locationID }, (err, doc) => {
    if (err) throw err;
    if (!doc) {
      newLocation.save(err => {
        if (err) throw err;
        res.json({ ajax: 'new location saved' });
      });
    } else {
      // adding a user to an existing location
      let docUsersID = doc.usersID;
      if (docUsersID.indexOf(userID) === -1) {
        docUsersID.push(userID);
        const count = docUsersID.length;
        const updatedDoc = {
          usersID: docUsersID,
          count: count
        };

        Location.update({ locationID: locationID }, updatedDoc, err => {
          if (err) throw err;
          res.json({ ajax: 'successful ++'});
        });
      } else {
        // removing a user from an existing location
        const index = docUsersID.indexOf(userID);
        docUsersID.splice(index, 1);
        const count = docUsersID.length;
        const updatedDoc = {
          usersID: docUsersID,
          count: count
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
