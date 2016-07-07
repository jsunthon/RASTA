var mongoose = require('mongoose');
var schema = mongoose.Schema;

var function_schema = new schema
(
  {
    name: String,
    critical_level: Number,
    services: [ { type: schema.Types.ObjectId, ref: 'APICall' } ]
  }
);

var Function = mongoose.model('Function', function_schema);
module.exports = Function;