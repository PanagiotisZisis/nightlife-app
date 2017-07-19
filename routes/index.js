'use strict';

const express = require('express');
const router = express.Router();
const yelp = require('yelp-fusion');

router.get('/', (req, res) => {
  res.render('index', { location: false, bars: false });
});

router.post('/', (req, res) => {
  const location = req.body.location;
  
  yelp.accessToken(process.env.CLIENT_ID, process.env.CLIENT_SECRET).then(response => {
    const client = yelp.client(response.jsonBody.access_token);

    client.search({
      term: 'Nightlife',
      categories: 'bars',
      location: location
    }).then(response => {
      res.render('index', { location: location, bars: response.jsonBody.businesses });
    });
  }).catch(e => {
    console.log(e);
  });
});

module.exports = router;
