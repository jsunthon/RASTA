//var init = require('./dbInit.js');
var IssueTicket = require('./../models/issue_ticket.js');
var AsyncIssueTicket = require('./../models/issue_ticket_async.js');
var TestResult = require('./../models/test_result.js');
var AsyncTestResult = require('./../models/async_call_result.js');
var db = require('./dbInit').goose;

function TicketDbManager() {

  /**
   * Given some test results, insert a ticket if necessary
   * @param test_results
   */
  this.insertTickets = function (test_results) {
    var badTestResults = test_results.filter(function (test_result) {
      if (test_result) {
        return test_result.result <= 1;
      }
    });

    var promise = badTestResults.map(function (test_result) {
      return new Promise(function (resolve, reject) {
        TestResult.findOne(
          {
            service_name: test_result.serviceName,
            test_date: test_result.testDate.valueOf()
          },
          function (err, found_one) {
            if (err) {
              console.error('err..');
              resolve();
            }
            if (found_one) {
              resolve(found_one._id);
            }
          }
        );
      });
    });

    Promise.all(promise).then(function (unsuccessful_ids) {
      unsuccessful_ids = unsuccessful_ids.filter(function (id) {
        return id !== null;
      });
      var ticket = new IssueTicket({
        open_date: badTestResults[0].testDate,
        issues: unsuccessful_ids
      });
      ticket.save(function (err, ticket) {
        if (err) {
          console.error(err);
        } else if (ticket) {
          var emailGen = require('../../logic/EmailGenerator.js');
          emailGen.sendEmail();
        }
      });
    });
  };

  this.insertAsyncTickets = function(test_results) {
    console.log('Calling insertAsyncTickets.');
    var badTestResults = test_results.filter(function (test_result) {
      if (test_result) {
        return test_result.test_result <= 1;
      }
    });

    console.log('Bad test res: ' + JSON.stringify(badTestResults));

    var promise = badTestResults.map(function (test_result) {
      return new Promise(function (resolve, reject) {
        AsyncTestResult.findOne(
          {
            _id: test_result._id,
            test_date: test_result.test_date.valueOf()
          },
          function (err, found_one) {
            if (err) {
              console.error('err..');
              resolve();
            }
            if (found_one) {
              resolve(found_one._id);
            }
          }
        );
      });
    });

    Promise.all(promise).then(function (unsuccessful_ids) {
      unsuccessful_ids = unsuccessful_ids.filter(function (id) {
        return id !== null;
      });
      var ticket = new AsyncIssueTicket({
        open_date: badTestResults[0].test_date,
        issues: unsuccessful_ids
      });
      ticket.save(function (err, ticket) {
        if (err) {
          console.error(err);
        } else if (ticket) {
          var emailGen = require('../../logic/EmailGenerator.js');
          emailGen.sendEmail();
        }
      });
    });
  }

  /**
   * Given a ticket ID, close it.
   * @param ticket_id
   * @returns {Promise}
   */
  this.closeATicket = function (ticket_id) {
    return new Promise(function (resolve, reject) {
      IssueTicket.update({_id: ticket_id}, {status: 0}, function (err, num_affected, raw_res) {
        if (err) resolve(503);
        if (num_affected.nModified > 0) resolve(200);
        else resolve(503);
      });
    });
  };

  /**
   * Retieve tickets created on the current day
   * @returns {Promise} a promise of an array of tickets
   */
  this.retrieveTickets = function () {
    return new Promise(function (resolve, reject) {
      var today = new Date();
      IssueTicket.find(
        {
          open_day: today.getDate(),
          open_month: today.getMonth() + 1,
          open_year: today.getFullYear(),
          status: 1
        }
      )
        .populate('issues')
        .exec(function (err, found_tickets) {
          if (err) console.error(err);
          IssueTicket.populate(found_tickets, {
            path: 'issues.service_id',
            model: 'APICall'
          }, function (err, populated_tickets) {
            populated_tickets.map(function (ticket) {
              ticket.issues.sort(function (x, y) {
                if (x.service_name < y.service_name) return -1;
                if (x.service_name > y.service_name) return 1;
                return 0;
              })
            });
            resolve(populated_tickets);
          });
        });
    });
  };
}

module.exports = new TicketDbManager();