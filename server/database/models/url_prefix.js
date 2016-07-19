var mongoose = require('mongoose');
var schema = mongoose.Schema;

var prefix_schema = new schema ({
  prefix: { type: String, unique: true }
});

var URLPrefix = mongoose.model('URLPrefix', prefix_schema);

module.exports = URLPrefix;