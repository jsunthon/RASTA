var mongoose = require('mongoose');
var schema = mongoose.Schema;

var test_schema = new schema
(
  {
    service_id: schema.Types.ObjectId,
    service_name: String,
    test_result: Number,
    test_date: Number,
    critical_level: Number
  }
);

var TestResult = mongoose.model('TestResult', test_schema);

module.exports = TestResult;