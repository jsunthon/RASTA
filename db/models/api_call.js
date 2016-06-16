var mongoose = require('mongoose');
var schema = mongoose.Schema;

var api_shema = new schema
(
  {
    name: String,
    url: String,
    desired_response: String
  }
)