var mongoose = require('mongoose');
var config = require('../config/constants');

function DBInit() {
  if (mongoose.connection.readyState == 0) {
    mongoose.connect(config.database);
  }

  mongoose.Promise = Promise;
  this.database = mongoose.connection;
  this.database.once('error', console.error.bind(console, 'connection error'));
}

var init = new DBInit();
module.exports = init.db;