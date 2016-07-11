var mongoose = require('mongoose');
var schema = mongoose.Schema;

var api_schema = new schema
(
  {
    name: { type: String, unique: true },
    url: { type: String, unique: true },
    response_type: String,
    type: String
  }
);

api_schema.pre('save', function (next) {
  mongoose.model('APICall').find({ name: this.name }).remove().exec(function (err) {
    if (err) return console.error(err);
    next();
  });
});

var APICall = mongoose.model('APICall', api_schema);

module.exports = APICall;