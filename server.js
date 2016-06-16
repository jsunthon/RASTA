var express = require('express');
var mongoose = require('mongoose');

var app = express();

require('./api/routes')(app)

app.listen(8080, function () {
  console.log('Server is running')
})