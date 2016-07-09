var emailjs = require("emailjs");
var Email = require("./../models/email.js");

function EmailDbManager() {

    /**
     * Takes in an email to add as well as the username of whom added it
     * @param email
     *              Email to be added
     * @param loggedInUser
     *              Username of the person that added that email
     */
    this.saveEmail = function (email, loggedInUser) {
        return new Promise(function(resolve, reject) {
            var newEmail = new Email({
                email: email,
                addedBy: loggedInUser
            });
            newEmail.save(function (err) {
                var responseObj;
                if (err) {
                    responseObj = {success: false, msg: 'Failed'};
                } else {
                    responseObj = {success: true, msg: 'Successfully added emailjs'};
                }
                resolve(responseObj);
            });
        });
    }

    /**
     * Remove the specified email
     * @param email
     */
    this.removeEmail = function (email) {
        return new Promise(function(resolve, reject) {
            Email.remove({email: email}, function (err, email) {
                var response;
                if (err) {
                    response = {success: false, msg: email + " was not removed!"};
                } else {
                    response = {success: true, msg: email + " was removed!"};
                }
                resolve(response);
            });
        });
    }

    /**
     * Get all the unique emails, then send an email to them
     */
    this.sendEmails = function () {
        Email.distinct('emailjs', function (err, results) {
                var toEmails = results.reduce(function (prev, curr) {
                    return prev + ", " + curr;
                });
                createEmail(toEmails);
            }
        );
    }


    /**
     * Return a list of email recipients stored in the database
     */
    this.getEmails = function() {
        return new Promise(function(resolve, reject) {
            Email.find({}).exec(function(err, emails) {
                resolve(emails);
            });
        });
    }

    /**
     * Create an email and send it to toEmails
     * @param toEmails
     *                  Email addr to send emails to
     */
    var createEmail = function (toEmails) {
        var server = emailjs.server.connect({
            user: "",
            password: "",
            host: "smtp.jpl.nasa.gov",
            ssl: true
        });

        var message = {
            text: "Here are the current open tickets for the LMMP web services",
            from: "noreply@rasta.jpl.nasa.gov",
            to: toEmails,
            //cc:      "else <else@your-emailjs.com>",
            subject: "RASTA: Current Web Service Tickets",
            attachment: [
                {data: "<html>I can see <b>you</b></html>", alternative: true},
                {path: "../RASTA/sample.json", type: "application/json", name: "renamed.json"}
            ]
        };

        server.send(message, function (err, message) {
            console.log(err || message);
        });
    }
}

module.exports = new EmailDbManager();
