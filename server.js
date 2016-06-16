var express = require('express');
var mongoose = require('mongoose');

var app = express();

require('./api/routes')(app)

app.get('*', function (req, res) {
  res.sendFile('./views/index.html', { root: __dirname });
})

app.listen(8080, function () {
  console.log('Server is running')
})