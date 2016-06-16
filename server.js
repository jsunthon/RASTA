var express = require('express');
var mongoose = require('mongoose');

var app = express();

require('./api/routes')(app)

app.use(express.static('public'));

app.get('*', function (req, res) {
  res.sendFile('./index.html', { root: './views' });
  //res.send('./views/index.html');
})

app.listen(8080, function () {
  console.log('Server is running')
})