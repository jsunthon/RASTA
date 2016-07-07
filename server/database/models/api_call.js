var mongoose = require('mongoose');
var schema = mongoose.Schema;

var api_shema = new schema
(
  {
    name: String,
    url: String,
    response_type: String,
    type: String
  }
);

api_shema.pre('save', function (next) {
  mongoose.model()
});

var APICall = mongoose.model('APICall', api_shema);

module.exports = APICall;