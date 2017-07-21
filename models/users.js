'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema ({
  facebookID: String,
  facebookToken: String,
  facebookName: String,
  locations: [String]
});

module.exports = mongoose.model('User', userSchema);