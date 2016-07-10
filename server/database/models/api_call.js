var mongoose = require('mongoose');
var schema = mongoose.Schema;

var api_schema = new schema
(
  {
    name: String,
    url: String,
    response_type: String,
    type: String
  }
);

<<<<<<< HEAD
api_schema.pre('save', function (next) {
  mongoose.model('APICall').findOne({ name: this.name }).remove().exec(next());
});

var APICall = mongoose.model('APICall', api_schema);
=======
var APICall = mongoose.model('APICall', api_shema);
>>>>>>> c5f69186ec7457af2ead5cf2cd231507d1925b95

module.exports = APICall;