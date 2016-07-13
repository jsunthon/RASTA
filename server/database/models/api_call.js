var mongoose = require('mongoose');
var APIFunction = require('./api_function');
var schema = mongoose.Schema;

var api_schema = new schema
(
  {
    date: Date,
    name: { type: String, unique: true },
    raw_url: String,
    base_url: { type: String, unique: true },
    url: String,
    response_type: String,
    type: String,
    functions: [{ type: schema.Types.ObjectId, ref: 'Function' }],
    function_name: String
  }
);

api_schema.pre('save', function (next) {
  mongoose.model('APICall').findOne({ base_url: this.base_url }).remove().exec(function (err, deleted_call) {
    if (err) return console.error(err);
    APIFunction.findOneAndUpdate({ name: this.function_name },
      { name: this.function_name, $push: { services: this._id } },
      { upsert: true}, function (err, upserted_function) {
        if (err) return console.error(err);
        this.functions = [upserted_function._id];
        if (deleted_call && deleted_call.functions) this.functions.concat(deleted_call.functions())
      });
    next();
  });
});

var APICall = mongoose.model('APICall', api_schema);

module.exports = APICall;