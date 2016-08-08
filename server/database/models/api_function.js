var mongoose = require('mongoose');
var schema = mongoose.Schema;

var function_schema = new schema
(
  {
    name: { type: String, unique: true },
    services: [ { type: schema.Types.ObjectId, ref: 'APICall' } ]
  }
);

function_schema.pre('save', function (next) {
  mongoose.model('Function').find({ name: this.name }).remove().exec(function () {
    next();
  })
});

var Function = mongoose.model('Function', function_schema);
module.exports = Function;