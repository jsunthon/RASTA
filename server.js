var express = require('express');
var app = express();

require('./api/routes')(app)

app.listen(8080, function () {
  console.log('Server is running')
})