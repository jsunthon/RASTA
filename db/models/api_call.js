var mongoose = require('mongoose');
var schema = mongoose.Schema;

mongoose.connect('mongodb://localhost/rasta_db');

var api_shema = new schema
(
  {
    name: String,
    url: String,
    response_type: String,
    desired_response: String
  }
)

var APICall = mongoose.model('APICall', api_shema);

module.exports = APICall;