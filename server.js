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

// Logout
apiRoutes.get('/logout', function (req, res) {
  req.logout();
  console.log("You've logged out");
  res.json({loggedOut: true});
});

// Add email to database
apiRoutes.post('/addEmail/:email', function (req, res) {
  var email = req.params.email;
  console.log("TYPE: " + email.constructor);
  email = email.toString().toLowerCase();

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

// Add new user
apiRoutes.post('/signup/:username/:password', function (req, res) {
  var username = req.params.username;
  username = username.charAt(0).toUpperCase() + username.slice(1).toLowerCase();
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

// Authenticate user/password
apiRoutes.post('/authenticate/:username/:password', function (req, res) {
  var username = req.params.username;
  username = username.charAt(0).toUpperCase() + username.slice(1).toLowerCase();;
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

// remove email recipient
apiRoutes.post('/removeEmail/:email', function (req, res) {
  var rmEmail = req.params.email;
  console.log("Hi " + rmEmail);
  Email.remove({email: rmEmail}, function (err, email) {
    if (err) {
      return res.json({success: false, msg: rmEmail + " was not removed!"});
    } else {
      return res.json({success: true, msg: rmEmail + " was removed!"});
    }
  });
});

// Remove user
apiRoutes.post('/removeUser/:user', function (req, res) {
  var rmUser = req.params.user;
  console.log("Removing: " + rmUser);
  User.remove({name: rmUser}, function (err, usr) {
    if (err) {
      return res.json({success: false, msg: rmUser + " was not removed!"});
    } else {
      return res.json({success: true, msg: rmUser + " was removed!"});
    }
  })
});

// List all users
apiRoutes.get('/users', function (req, res) {
  var arr = [];
  User.find({}, {_id: 0, password: 0, __v: 0}, function (err, usr) {
    if (err) {
      return res.json({success: false, users: []});
    } else {
      for (var a = 0; a < usr.length; a++) {
        arr[a] = usr[a].toString().replace("{ name: '", "");
        arr[a] = arr[a].replace("' }", "").trim();
      }
      arr = arr.map(function (user) {
        return {
          user: user
        }
      });
      console.log(arr);
      return res.json({success: true, users: arr});
    }
  });
});

// List all email recipients
apiRoutes.get('/emails', function (req, res) {
  var arr = [];
  Email.find({}, {_id: 0, __v: 0}, function (err, email) {
    //Email.find({}, {_id: 0, email: 1}, function (err, email) {
    if (err) {
      return res.json({success: false, emails: []});
    }
    else {
      for (var a = 0; a < email.length; a++) {
        arr[a] = email[a].toString().replace("{ email: '", "");
        arr[a] = arr[a].replace("' }", "").trim();
      }
      arr = arr.map(function (email) {
        return {
          email: email
        }
      });
      console.log(arr);
      return res.json({success: true, emails: arr});
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
  startScheduledTests(function () {
    var tester = new Tester();
    console.log("Start test all services...");
    tester.startScheduledTests();
  });
  insertDefaultUser();
});


app.use(express.static('client/public'));

require('./api/routes')(app);
require('./client/routes')(app);

function startScheduledTests(testSetup) {
  testSetup();
  setInterval(testSetup, 5000);
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

