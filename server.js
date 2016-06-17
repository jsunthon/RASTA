var express = require('express');
var mongoose = require('mongoose');
var API_call = require('./db/models/api_call');

var app = express();

app.get('/add', function (req, res) {
  mongoose.connect('mongodb://localhost/rasta_db');
  var db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error'));
  db.open('open', function()
  {
    var api_call = new API_call(
      {
        name: "api",
        url: "http://www.yahoo.com",
        response_type: "html",
        desired_response: "html"
      }
    );
    api_call.save(function(err, api_call)
    {
      if(err) return console.error(err);
    });
  });
  API_call.find(function(err, apis)
  {
    if (err) return console.error(err);
    else
    {
      res.send(apis);
    }
  })
});

require('./api/routes')(app)

app.use(express.static('public'));

app.get('*', function (req, res) {
  res.sendFile('views/index.html', { root: __dirname });
  //res.send('./views/index.html');
});

app.listen(8080, function () {
  console.log('Server is running')
});