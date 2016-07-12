var emailjs = require("emailjs");
var Email = require("./../models/email.js");
var db = require('./dbInit').goose;

function EmailDbManager() {

  /**
   * Takes in an email to add as well as the username of whom added it
   * @param email
   *              Email to be added
   * @param loggedInUser
   *              Username of the person that added that email
   */
  this.saveEmail = function (email, loggedInUser) {
    return new Promise(function (resolve, reject) {
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
  };

  /**
   * Remove the specified email
   * @param email
   */
  this.removeEmail = function (email) {
    return new Promise(function (resolve, reject) {
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
   * Get all the unique emails, and generate a recipients str
   */
  this.getEmailRecipientStr = function () {
    return new Promise(function (resolve, reject) {
      Email.distinct('email', function (err, results) {
        var toEmails = results.reduce(function (prev, curr) {
          return prev + ", " + curr;
        }, '');
        resolve(toEmails);
      });
    });
  }


  /**
   * Return a list of email recipients stored in the database
   */
  this.getEmails = function () {
    return new Promise(function (resolve, reject) {
      Email.find({}).exec(function (err, emails) {
        resolve(emails);
      });
    });
  }
}

module.exports = new EmailDbManager();
