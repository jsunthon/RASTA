var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');
var passport = require('passport');
var jwt = require('jwt-simple');
var config = require('./config/database');
var User = require('./app/models/user');
var Email = require('./app/models/email');
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

apiRoutes.get('/logout', function (req, res) {
  req.logout();
  console.log("You've logged out");
  res.json({loggedOut: true});
});

apiRoutes.post('/addEmail/:email', function (req, res) {
  var email = req.params.email;
  console.log(email);

  if (!email) {
    res.json({success: false, msg: "Email is missing"});
  } else {
    var newEmail = new Email({
      email: email
    });
    newEmail.save(function (err) {
      if (err) {
        res.json({success: false, msg: 'Failed'});
      } else {
        res.json({success: true, msg: 'Successfully added email'});
      }
    })
  }
});

apiRoutes.post('/signup/:username/:password', function (req, res) {
  var username = req.params.username;
  console.log(username);
  var password = req.params.password;

  if (!username || !password) {
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


apiRoutes.get('/emails', function(req, res){
  var a = Email.findOne();
  console.log(a);
});


apiRoutes.get('/validateUser', function (req, res) {
  var cookiesObj = parseCookies(req);
  var token = cookiesObj.token;
  if (token) {
    var decoded = jwt.decode(token, config.secret);
    User.findOne({
      name: decoded.name
    }, function (err, user) {
      if (err) throw err;

      if (!user) {
        return res.status(401).send({success: false, msg: "Authentication failed. User not found."});
      } else {
        console.log("a user");
        return res.json({success: true});
      }
    });
  } else {
    return res.status(401).send({success: false, msg: "No token provided"});
  }
});

//getToken = function (cookie) {
//  req.header.cookies
//}

function parseCookies (request) {
  var list = {},
      rc = request.headers.cookie;

  rc && rc.split(';').forEach(function( cookie ) {
    var parts = cookie.split('=');
    list[parts.shift().trim()] = decodeURI(parts.join('='));
  });

  return list;
}

app.use('/api', apiRoutes);

// Start the server
app.listen(8080, function () {
  console.log('Server is running on port:' + port);
  startScheduledTests(function () {
    var tester = new Tester();
    tester.startScheduledTests();
  });
  insertDefaultUser();
});


app.use(express.static('client/public'));

require('./api/routes')(app);
require('./client/routes')(app);

function startScheduledTests(testSetup) {
  testSetup();
  setInterval(testSetup, 10000);
}

function insertDefaultUser() {
  User.findOne({name: "Ray"}, function (err, found_user) {
    if (err) return console.error(err);
    if (found_user == null) {
      var new_user = new User(
        {
          name: "Ray",
          password: "aa1234"
        }
      );
      new_user.save();
    }
  })
}

