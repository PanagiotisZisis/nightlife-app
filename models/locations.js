'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const locationSchema = new Schema ({
  locationID: String,
  usersID: [String],
  createdAt: {
    type: Date,
    default: Date.now,
    expires: '12h'
  }
});

module.exports = mongoose.model('Location', locationSchema);