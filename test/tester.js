var superagent = require('superagent');
var dbManager = require('../db/db_manager');

function Tester() {

  var dbInstance = dbManager;
  this.created = new Date();
  
  this.startScheduledTests = function() {
    console.log("Calling startScheduledTests in tester.js");
    dbInstance.testAllService(this.makeApiCall, this);
  };

  this.makeApiCall = function(url, thisTester) {
    console.log(thisTester.created.valueOf());
    console.log("calling makeApiCall");
    superagent
      .get(url)
      .end(function (err, result) {
        if (err || result.statusCode !== 200) {
          console.log('err');
        }
        else {
          console.log("Call to : " + url + " successful");
          dbInstance.insertTestResult(url, 1, thisTester.created.valueOf());
        }
      });
  }
}

module.exports = Tester;