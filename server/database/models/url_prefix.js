var mongoose = require('mongoose');
var schema = mongoose.Schema;

var prefix_schema = new schema ({
  prefix: { type: String, unique: true }
});

var URLPrefix = mongoose.model('URLPrefix', prefix_schema);

prefix_schema.pre('save', function (next) {
  if (!this.prefix.startsWith('http://') && !this.prefix.startsWith('HTTP://')) {
    this.prefix = 'http://' + this.prefix;
    next();
  }
});

module.exports = URLPrefix;