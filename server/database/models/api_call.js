var mongoose = require('mongoose');
var schema = mongoose.Schema;

var api_schema = new schema
(
  {
    date: Date,
    name: { type: String, unique: true },
    raw_url: String,
    base_url: { type: String, unique: true },
    response_type: String,
    type: String
    // functions: [{ type: schema.Types.ObjectId, ref: 'Function' }]
  }
);

api_schema.pre('save', function (next) {
  this.url = 'https://pub.lmmp.nasa.gov' + this.raw_url;
  this.base_url = this.raw_url.split('?')[0];
  mongoose.model('APICall').find({ base_url: this.base_url }).remove().exec(function (err) {
    if (err) return console.error(err);
    next();
  });
});

var APICall = mongoose.model('APICall', api_schema);

module.exports = APICall;