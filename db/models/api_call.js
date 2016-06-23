var mongoose = require('mongoose');
var schema = mongoose.Schema;

var api_shema = new schema
(
  {
    name: String,
    url: String,
    response_type: String,
    type: String,
    critical_level: Number
  }
);

var APICall = mongoose.model('APICall', api_shema);

module.exports = APICall;