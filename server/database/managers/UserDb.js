var User = require("./../models/user.js");
var jwt = require('jwt-simple');
var config = require('../../config/constants.js');
function UserDbManager() {
    var loggedInUser = "";

    /**
     * Add a user
     */
    this.addUser = function(username, password, loggedInUser) {
        return new Promise(function(resolve, reject) {
            if (!username || !password) {
                res.json({success: false, msg: 'Something is missing'});
            } else {
                var newUser = new User({
                    name: username,
                    password: password,
                    addedBy: loggedInUser
                });
                newUser.save(function (err) {
                    var response;
                    if (err) {
                        console.log("error detected: " + err);
                        response = {success: false, msg: 'Username already exists'};
                    } else {
                        console.log("no error detected");
                        response = {success: true, msg: 'Successful created user'};
                    }
                    resolve(response);
                });
            }
        });
    }

    /**
     * Given a user, remove them.
     * @param user
     */
    this.removeUser = function(user, res) {
        return new Promise(function(resolve, reject) {
            User.remove({name: user}, function (err, user) {
                var response;
                if (err) {
                    response = {success: false, msg: user + " was not removed!"};
                } else {
                    response = {success: true, msg: user + " was removed!"};
                }
                resolve(response);
            });
        });
    }


    /**
     * Authenticate a user with the given username and pw.
     * @param username
     * @param password
     * @param res
     */
    this.authenticateUser = function(username, password) {
        return new Promise(function(resolve, reject) {
            User.findOne({
                name: username
            }, function (err, user) {
                var response;
                if (err) {
                    response = err;
                    resolve(response);
                }
                if (!user) {
                    response = {success: false, msg: 'Authentication failed. User not found.'};
                    resolve(response);
                } else {
                    user.comparePassword(password, function (err, isMatch) {
                        if (isMatch && !err) {
                            var token = jwt.encode(user, config.secret);// IMPORTANT FOR AUTHENTICATION
                            loggedInUser = username;
                            response = {success: true, token: 'JWT ' + token, name: username};
                            console.log("The currently logged in user is: " + loggedInUser);
                        } else {
                            response = {success: false, msg: 'Authentication failed. Wrong password.'};
                        }
                        resolve(response);
                    });
                }
            });
        });
    }

    /**
     * Retrieve all the users from the db.
     */
    this.getUsers = function() {
        return new Promise(function(resolve, reject) {
           User.find({}, {name: 1, addedBy: 1}).exec(function(err, users) {
               resolve(users);
           });
        });
    }

    this.validateUser = function(req, res) {
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
    }
    /**
     * Take a request object, get the cookies, and return a list of key values
     * @param request
     * @returns {{}}
     */
    var parseCookies = function (request) {
        var list = {},
            rc = request.headers.cookie;
        rc && rc.split(';').forEach(function (cookie) {
            var parts = cookie.split('=');
            list[parts.shift().trim()] = decodeURI(parts.join('='));
        });

        return list;
    }
}

module.exports = new UserDbManager();
