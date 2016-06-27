var superagent = require('superagent');
var dbManager = require('../db/db_manager');

function Tester() {

  var dbInstance = new dbManager('mongodb://localhost/rasta_db');
  this.created = new Date();
  
  this.startScheduledTests = function() {
    dbInstance.testAllService(makeApiCall);
  }

  var makeApiCall = function(url) {
    console.log("calling makeApiCall");
    superagent
      .get(url)
      .end(function (err, result) {
        if (err || result.statusCode !== 200) {
          console.log(err);
        }
        else {
          console.log("Call to : " + url + " successful");
          dbInstance.insertTestResult(url, 1, this.created.getDate());
        }
      });
  }
}

module.exports = Tester;