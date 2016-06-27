var superagent = require('superagent');
var dbManager = require('../db/db_manager');

function Tester() {

  var dbInstance = new dbManager('mongodb://localhost/rasta_db');
  this.created = new Date();
  
  this.startScheduledTests = function() {
    dbInstance.testAllService(makeApiCall)
  }

  var makeApiCall = function(url) {
    superagent
      .get(url)
      .end(function (err, result) {
        if (err || result.statusCode !== 200) {
          res.send(err);
        }
        else {
          dbInstance.insertTestResult(url, 1, this.created.getDate());
        }
      });
  }
}

module.exports = Tester;