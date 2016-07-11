var UserDbManager = require('../database/managers/UserDb.js');

module.exports = function(app) {
    var userDbInst = UserDbManager;
    /**
     * Route for logging out a user
     */
    app.get('/api/logout', function (req, res) {
        req.logout();
        res.json({loggedOut: true});
    });

    /**
     * Route for adding a user (signing them up)
     */
    app.post('/api/signup/:username/:password/:addedBy', function (req, res) {
        var username = req.params.username;
        username = username.charAt(0).toUpperCase() + username.slice(1).toLowerCase();
        var password = req.params.password;
        var loggedInUser = req.params.addedBy;
        userDbInst.addUser(username, password, loggedInUser).then(function(response) {
            res.json(response);
        });
    });

    /**
     * Route for removing a user
     */
    app.post('/api/removeUser/:user', function (req, res) {
        var rmUser = req.params.user;
        userDbInst.removeUser(rmUser).then(function(response) {
            res.json(response);
        });
    });

    /**
     * Route for authenticating a user via a username and password
     */
    app.post('/api/authenticate/:username/:password', function (req, res) {
        var username = req.params.username;
        username = username.charAt(0).toUpperCase() + username.slice(1).toLowerCase();
        var password = req.params.password;
        userDbInst.authenticateUser(username, password).then(function(response) {
            res.json(response);
        });
    });

    /**
     * Route for getting a list of all users
     */
    app.get('/api/users', function (req, res) {
       userDbInst.getUsers().then(function(response) {
           res.send(response);
       });
    });

    /**
     * Route for validate a user via cookie headers
     */
    app.get('/api/validateUser', function (req, res) {
        userDbInst.validateUser(req, res);
    });
}