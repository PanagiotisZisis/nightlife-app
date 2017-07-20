'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema ({
  id: String,
  token: String,
  name: String,
  locations: [String]
});

module.exports = mongoose.model('User', userSchema);