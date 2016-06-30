var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//Set up a mongoose model

var EmailSchema = new Schema ({
  email: {
    type: String,
    unique: true,
    required: true
  }
});

module.exports = mongoose.model('Email', EmailSchema);