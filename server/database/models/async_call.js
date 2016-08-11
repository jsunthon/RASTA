var mongoose = require('mongoose');
var schema = mongoose.Schema;

var async_schema = new schema({
  name: { type: String, unique: true },
  date: Date,
  job_creator: {
    base_url: { type: String, unique: true },
    parameters: [ [ { name: String, value: String } ] ],
    request_type: String,
    response_type: String
  },
  job_checker: String,
  function: { type: schema.Types.ObjectID, ref: 'Function' },
  time_out: { type: Number, default: 50000 }
});