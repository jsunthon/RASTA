var mongoose = require('mongoose');
var schema = mongoose.Schema;

var async_result_schema = new schema({
  service_id: { type: schema.Types.ObjectId, ref: 'AsyncCall' },
  service_name: String,
  test_result: Number,
  test_date: Date,
  status_code: Number,
  response_time: Number
});

var asyncCallResult = mongoose.model('AsyncTestResult', async_result_schema);
module.exports = asyncCallResult;