var express = require('express');
var mongoose = require('mongoose');
var API_call = require('./db/models/api_call');

var app = express();

require('./api/routes')(app)

app.use(express.static('public'));

app.get('*', function (req, res) {
  res.sendFile('./views/index.html', { root: './' });
  //res.send('./views/index.html');
});

app.get('/add', function (req, res) {
  var api_call = API_call(
    {
      name: "api",
      url: "http://www.yahoo.com",
      response_type: "html",
      desired_response: "html"
    }
  );
  api_call.save(function (err) {
    if (err) throw err;
  });
  API_call.find

  )
});

app.listen(8080, function () {
  console.log('Server is running')
});