var emailjs = require("emailjs");
var Email = require("./../models/email.js");

function EmailDbManager() {
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
     * Takes in an email to add as well as the username of whom added it
     * @param email
     *              Email to be added
     * @param loggedInUser
     *              Username of the person that added that email
     */
    this.saveEmail = function (email, loggedInUser, res) {
        var newEmail = new Email({
            email: email,
            addedBy: loggedInUser
        });
        newEmail.save(function (err) {
            if (err) {
                console.log("err");
                res.json({success: false, msg: 'Failed'});
            } else {
                res.json({success: true, msg: 'Successfully added emailjs'});
            }
        });
    }

    /**
     * Remove the specified email
     * @param email
     */
    this.removeEmail = function (email, res) {
        Email.remove({email: email}, function (err, email) {
            if (err) {
                return res.json({success: false, msg: email + " was not removed!"});
            } else {
                return res.json({success: true, msg: email + " was removed!"});
            }
        });
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
