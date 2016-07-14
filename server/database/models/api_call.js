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
  var self = this;
  mongoose.model('APICall').findOneAndRemove({ base_url: this.base_url }, function (err, deleted_call){
    if (err) return console.error(err);
    // console.log(self.function_name);
    // console.log(self._id);
    var promise = new Promise(function(resolve) {
      APIFunction.findOneAndUpdate({ name: self.function_name },
        { $set: {name: self.function_name}, $push: { services: self._id } },
        { upsert: true }, function (err, upserted_function) {
          if (err) {
            console.error(err);
          }
          if (upserted_function) self.functions = [upserted_function._id];
          else self.functions = [];
          if (deleted_call && deleted_call.functions) self.functions.concat(deleted_call.functions);
          //console.log(upserted_function);
          resolve();
        });
    });
    promise.then(function(response) {
      console.log("Promise resolved");
      next();
    });
  });
});

var APICall = mongoose.model('APICall', api_schema);

module.exports = APICall;