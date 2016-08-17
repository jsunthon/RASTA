var mongoose = require('mongoose');
var schema = mongoose.Schema;

var async_schema = new schema({
  name: { type: String, unique: true },
  date: Date,
  job_creator: {
    base_url: { type: String, unique: true },
    parameters: [ [ { name: String, value: String } ] ],
    request_type: { type: String, default: 'get'},
    response_type: { type: String, default: 'application/xml' }
  },
  job_checker: String,
  time_out: { type: Number, default: 50000 }
});

async_schema.pre('save', function (next, done) {
  var self = this;
  mongoose.model('AsyncCall').findOne({ 'job_creator.base_url': self.job_creator.base_url }, function (err, found_call)
  {
    if (err) {
      console.error(err);
      done();
    }
    if (found_call) {
      console.log('found');
      found_call.job_creator.parameters.concat(self.job_creator.parameters);
      found_call.save(function () {
        if (err) console.error(err);
        done();
      })
    }
    else {
      next();
    }
  })
});

var AsyncCall = mongoose.model('AsyncCall', async_schema);

module.exports = AsyncCall;