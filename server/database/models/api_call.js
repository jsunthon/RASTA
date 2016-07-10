var mongoose = require('mongoose');
var schema = mongoose.Schema;

var api_schema = new schema
(
  {
    name: String,
    url: String,
    response_type: String,
    type: String
  }
);

api_schema.pre('save', function (next) {
  mongoose.model('APICall').findOne({ name: this.name }).remove().exec(next());
});

var APICall = mongoose.model('APICall', api_schema);

module.exports = APICall;