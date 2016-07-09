var EmailDbManager = require('../database/managers/EmailDb.js');

module.exports = function(app) {
    var emailDbInst = EmailDbManager;
    /**
     * Route for adding an email
     */
    app.post('/api/addEmail/:email/:addedBy', function (req, res) {
        var email = req.params.email;
        var addedBy = req.params.addedBy;
        console.log(addedBy);
        email = email.toString().toLowerCase();

        if (!email) {
            res.json({success: false, msg: "Email is missing"});
        } else {
            emailDbInst.saveEmail(email, addedBy, res);
        }
    });

    /**
     * Route for removing an email
     */
    app.post('/api/removeEmail/:email', function (req, res) {
        var rmEmail = req.params.email;
        emailDbInst.removeEmail(rmEmail, res);
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