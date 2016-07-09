var User = require("./../models/user.js");
var jwt = require('jwt-simple');
var config = require('../../config/constants.js');
function UserDbManager() {
    var loggedInUser = "";

    /**
     * Add a user
     */
    this.addUser = function(username, password, res) {
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
            });
        }
    }

    /**
     * Given a user, remove them.
     * @param user
     */
    this.removeUser = function(user, res) {
        console.log("Removing: " + user);
        User.remove({name: user}, function (err, user) {
            if (err) {
                return res.json({success: false, msg: user + " was not removed!"});
            } else {
                return res.json({success: true, msg: user + " was removed!"});
            }
        });
    }


    /**
     * Authenticate a user with the given username and pw.
     * @param username
     * @param password
     * @param res
     */
    this.authenticateUser = function(username, password, res) {
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
    }

    /**
     * Retrieve all the users from the db.
     */
    this.getUsers = function(res) {
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
