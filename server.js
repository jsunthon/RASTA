var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');
var passport = require('passport');
var jwt = require('jwt-simple');
var config = require('./config/database');
var User = require('./app/models/user');
var port = process.env.PORT || 8080;
var Tester = require('./test/tester');
var DB_manager = require('./db/db_manager');


// Get out request params
app.use(bodyParser.urlencoded({limit: '50mb', extended: false}));
app.use(bodyParser.json({limit: '50mb'}));


// log to console
app.use(morgan('dev'));

// Use passport package in our application
app.use(passport.initialize());


//mongoose.connect(config.database);
var db_manager = DB_manager;
require('./config/passport')(passport);

var apiRoutes = express.Router();




apiRoutes.get('/logout', function(req, res){
  req.logout();
  console.log("You've logged out");
  res.json({loggedOut: true});
});




apiRoutes.post('/signup/:username/:password', function (req, res) {
  var username = req.params.username;
  console.log(username);
  var password = req.params.password;
  
  if (!username|| !password) {
    res.json({success: false, msg: 'Something is missing'});
  } else {
    var newUser = new User({
      name: username,
      password: password
    });
    newUser.save(function (err) {
      if (err) {
        res.json({success: false, msg: 'Username already exists'});
      } else {
        res.json({success: true, msg: 'Successful created user'});
      }
    })
  }
});

apiRoutes.post('/authenticate/:username/:password', function (req, res) {
  var username = req.params.username;
  console.log(username);
  var password = req.params.password;
  
  User.findOne({
    name: username
  }, function (err, user) {
    if (err) {
      res.send(err);
    }

    if (!user) {
      //return res.status(403).send({success: false, msg: 'Authentication failed. User not found'});
      res.send({success: false, msg: 'Authentication failed. User not found.'});
    } else {
      user.comparePassword(password, function (err, isMatch) {
        if (isMatch && !err) {
          var token = jwt.encode(user, config.secret);// IMPORTANT FOR AUTHENTICATION
          res.json({success: true, token: 'JWT ' + token, name: username});
        } else {
          //return res.status(403).send({success: false, msg: 'Authentication failed. Wrong password'});
          res.json({success: false, msg: 'Authentication failed. Wrong password.'});
        }
      });
    }
  });
});

apiRoutes.get('/memberinfo', passport.authenticate('jwt', {session: false}), function (req, res) {
  var token = getToken(req.headers);
  if (token) {
    var decoded = jwt.decode(token, config.secret);
    User.findOne({
      name: decoded.name
    }, function (err, user) {
      if (err) throw err;

      if (!user) {
        return res.status(403).send({success: false, msg: "Authentication failed. user not found"});
      } else {
        return res.json({success: true, msg: "Welcome in the memeber area " + user.name + "!"});
      }
    });
  } else {
    return res.status(403).send({success: false, msg: "No token provided"});
  }
});

getToken = function (headers) {
  if (headers && headers.authorization) {
    var parted = headers.authorization.split(' ');
    if (parted.length === 2) {
      return parted[1];
    } else {
      return null;
    }
  } else {
    return null;
  }
}

app.use('/api', apiRoutes);

// Start the server
app.listen(8080, function () {
  console.log('Server is running on port:' + port);
   startScheduledTests(function() {
     var tester = new Tester();
     console.log("Start test all services...");
     tester.startScheduledTests();
   });
});


app.use(express.static('client/public'));

require('./api/routes')(app);
require('./client/routes')(app);

function startScheduledTests(testSetup) {
  testSetup();
  setInterval(testSetup, 5000);
}

