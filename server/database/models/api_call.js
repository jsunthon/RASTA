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
    function: { type: schema.Types.ObjectId, ref: 'Function' },
    function_name: String,
    time_out: { type: Number, default: 5000 }
  }
);

api_schema.pre('save', function (next, done) {
  var self = this;
  mongoose.model('APICall').findOne({ base_url: self.base_url }, function (err, found_call){
    if (err) return console.error(err);

    if (!found_call) {
      if (self.function_name) {
        var promise = new Promise(function (resolve) {
          APIFunction.findOneAndUpdate({name: self.function_name},
            {$set: {name: self.function_name}, $push: {services: self._id}},
            {upsert: true}, function (err, upserted_function) {
              if (err) {
                console.error(err);
              }
              APIFunction.findOne({name: self.function_name}, function (err, found_function) {
                self.function = found_function._id;
                resolve();
              });
            });
        });
        promise.then(function (response) {
          //console.log("Promise resolved");
          next();
        });
      } else {
        next();
      }
    }
    else {
      console.log('no next');
      done();
    }
  });
});

api_schema.post('save', function (doc) {
  console.log(doc);
});

var APICall = mongoose.model('APICall', api_schema);

module.exports = APICall;