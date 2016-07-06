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
var loggedInUser;

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
      email: email,
      addedBy: loggedInUser
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
      password: password,
      addedBy: loggedInUser
    });
    newUser.save(function (err) {
      if (err) {
        console.log("error detected: " + err);
        res.json({success: false, msg: 'Username already exists'});
      } else {
        console.log("no error detected");
        res.json({success: true, msg: 'Successful created user'});
      }
    })
  }
});


// Authenticate user/password
apiRoutes.post('/authenticate/:username/:password', function (req, res) {
  var username = req.params.username;
  username = username.charAt(0).toUpperCase() + username.slice(1).toLowerCase();
  ;
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
          loggedInUser = username;
          res.json({success: true, token: 'JWT ' + token, name: username});
          console.log("The currently logged in user is: " + loggedInUser);
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
  var arr2 = [];
  User.find({}, {_id: 0, password: 0, __v: 0, addedBy: 0}, function (err, usr) {
    User.find({}, {_id: 0, name: 0, password: 0, __v: 0}, function (err, addedBy) {
      if (err) {
        return res.json({success: false, users: [], addedBy: []});
      } else {
        for (var a = 0; a < usr.length; a++) {
          arr[a] = usr[a].toString().replace("{ name: '", "");
          arr[a] = arr[a].replace("' }", "").trim();

          arr2[a] = addedBy[a].toString().replace("{ addedBy: '", "");
          arr2[a] = arr2[a].replace("' }", "").trim();
        }
        this.repeatData = arr.map(function (user, index) {
          return {
            user: user,
            addedBy: arr2[index]
          }
        });

        console.log("ARR: " + arr);
        console.log("ARR2: " + arr2);
        //return res.json({success: true, users: arr} );
        return res.json({success: true, users: repeatData});
      }
    });
  });
});

// List all email recipients
apiRoutes.get('/emails', function (req, res) {
  var arr = [];
  var arr2 = [];
  Email.find({}, {_id: 0, __v: 0, addedBy: 0}, function (err, email) {
    Email.find({}, {_id: 0, __v: 0, email: 0}, function (err, addedBy) {
      if (err) {
        return res.json({success: false, emails: [], addedBy: []});
      }
      else {
        for (var a = 0; a < email.length; a++) {
          arr[a] = email[a].toString().replace("{ email: '", "");
          arr[a] = arr[a].replace("' }", "").trim();

          arr2[a] = addedBy[a].toString().replace("{ addedBy: '", "");
          arr2[a] = arr2[a].replace("' }", "").trim();
        }
        this.repeatData = arr.map(function (email, index) {
          return {
            email: email,
            addedBy: arr2[index]
          }
        });
        console.log(arr);
        return res.json({success: true, emails: repeatData});
      }
    })
  });
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

function parseCookies(request) {
  var list = {},
    rc = request.headers.cookie;

  rc && rc.split(';').forEach(function (cookie) {
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
          password: "aa1234",
          addedBy: "AI"
        }
      );
      new_user.save();
    }
  })
}

