var mongoose = require('mongoose');
var schema = mongoose.Schema;

var test_schema = new schema
(
  {
    service_id: { type: schema.Types.ObjectId, ref: 'APICall' },
    service_name: String,
    test_result: Number,
    test_date: Date,
    status_code: Number,
    response_time: Number,
  }
);

var TestResult = mongoose.model('TestResult', test_schema);

module.exports = TestResult;