var EmailDbManager = require('../database/managers/EmailDb.js');

/**
 * This anonymous function that contains all the routes related
 * to email functionality
 * @param app
 *            app from app = express(); in server.js; provideded upon server start up
 */
module.exports = function(app) {
    var emailDbInst = EmailDbManager;

    /**
     * Route for adding an email
     */
    app.post('/api/addEmail/:email/:addedBy', function (req, res) {
        var email = req.params.email;
        var addedBy = req.params.addedBy;
        email = email.toString().toLowerCase();

        if (!email) {
            res.json({success: false, msg: "Email is missing"});
        } else {
            emailDbInst.saveEmail(email, addedBy).then(function(response) {
                res.json(response);
            });
        }
    });

    /**
     * Route for removing an email
     */
    app.post('/api/removeEmail/:email', function (req, res) {
        var rmEmail = req.params.email;
        emailDbInst.removeEmail(rmEmail).then(function(response) {
            res.json(response);
        });
    });

    /**
     * Route for getting a list of all emails
     */
    app.get('/api/emails', function (req, res) {
        emailDbInst.getEmails().then(function(response) {
            res.send(response);
        });
    });
}