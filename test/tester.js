var superagent = require('superagent');
var dbManager = require('../db/db_manager');
/** callResult :
 1 - No Response

 // Incorrect type
 1.33 - slow
 1.66 - medium
 2 - fast

 // Correct type
 2.33 - slow
 2.66 - medium
 3 - fast
 **/
function Tester() {

  var dbInstance = dbManager;
  this.created = new Date();
  var self = this;

  /**
   * Initiates a call to testAllService() in the dbManager, which will use
   * makeApiCall() as a callback to call on every service
   */
  this.startScheduledTests = function () {
    dbInstance.retrieveServiceListIPromise().then(function (services) {
      try {
        self.testServices(services);
      } catch(err) {
        console.error(err);
      }
    });
    //dbInstance.testAllService(this.makeScheduledApiCall, this);
  };

  this.testServices = function(services, res, caller) {
    var testDate = new Date();
    var promises = [];
    for (var i in services) {
      promises.push(this.makeManualApiCall(services[i], testDate));
    }

    Promise.all(promises).then(function(testResults) {
      //ray
      if (res == null) {
        dbInstance.insertTickets(testResults);
      }
      else {
        if (caller === "testAllServices") {
          var successes = testResults.filter(function(testResult) {
            return testResult.result === 3;
          });
          var failures = testResults.filter(function(testResult) {
            return testResult.result < 3;
          });
          testResults = JSON.stringify({successes : successes, failures: failures});
        }
        res.send(testResults);
      }
    }).catch(function(err) {
      console.error(err);
      res.send(err);
    });
  };

  this.testService = function(serviceObj, res) {
    var testDate = new Date();
    this.makeManualApiCall(serviceObj, testDate).then(function(result) {
      res.send(JSON.stringify(result));
    }, function(err, statusCode) {
      res.send(JSON.stringify({success: false, statusCode: statusCode}));
    });
  };

  this.makeManualApiCall = function (callObj, testDate) {
    return new Promise(function(resolve, reject) {
      var callName = callObj.name;
      var callUrl = callObj.url;
      var callResult = 1; //assume no response
      var httpMethod = callObj.type.toUpperCase();
      var respTime = 0;
      var fastTimeLimit = 1000;
      var mediumTimeLimit = 2500;
      var slowTimeLimit = 5000; //if the time that it takes to get a response passes this, then consider it delayed;
      var startTime = new Date().valueOf();

      var resultObj = {
        serviceName: callName,
        urlTested: callUrl,
        result: callResult,
        testDate : testDate.valueOf()
      };

      superagent(httpMethod, callUrl).end(function (err, res) {
        var endTime = new Date().valueOf();
        respTime = endTime - startTime;
        if (err || res.statusCode !== 200) {
          resultObj.rspTime = "FAIL";
          resultObj.expectedType = callObj.response_type;
          resultObj.receivedType = "FAIL";
          resultObj.statCode = res.statusCode;
          var promise = dbInstance.insertTestResult(callUrl, callResult, respTime, res.statusCode, testDate.valueOf());
          promise.then(function () {
            resolve(resultObj);
          });
        }
        else {
          var curResType = res.type;
          var targetResType = callObj.response_type;
          if (curResType === targetResType) {
            callResult++;
          }
          computeRspFactor();
          var promise = dbInstance.insertTestResult(callUrl, callResult, respTime, res.statusCode, testDate.valueOf());
          promise.then(function () {
            resultObj.rspTime = respTime + " ms";
            resultObj.expectedType = targetResType;
            resultObj.receivedType = curResType;
            resultObj.result = callResult;
            resultObj.testDate = testDate.valueOf();
            resultObj.statCode = res.statusCode;
            resolve(resultObj);
          });
        }

        function computeRspFactor() {
          if (respTime <= slowTimeLimit) {
            callResult = callResult + .33;
            if (respTime <= mediumTimeLimit) {
              callResult = callResult + .33;
              if (respTime <= fastTimeLimit) {
                callResult = callResult + .34;
              }
            }
          }
        }
      });
    });
  };

  /**
   * For a given call, make a http request, calculate the response results, and
   * store the result in the database
   * @param callObj
   *                 The service object
   * @param thisTester
   *                 Reference to the current instance of Tester (self)
   */
  this.makeScheduledApiCall = function (callObj, thisTester) {
    var callUrl = callObj.url;
    var callResult = 1; //assume no response
    var httpMethod = callObj.type.toUpperCase();
    var respTime = 0;
    var fastTimeLimit = 1000;
    var mediumTimeLimit = 2500;
    var slowTimeLimit = 5000; //if the time that it takes to get a response passes this, then consider it delayed;
    var startTime = new Date().valueOf();

    superagent(httpMethod, callUrl).end(function (err, res) {
      var endTime = new Date().valueOf();
      respTime = endTime - startTime;
      if (err || res.statusCode !== 200) {
        console.log("Didn't get a response");
      }
      else {
        var curResType = res.type;
        var targetResType = callObj.response_type;
        if (curResType === targetResType) {
          callResult++;
        }
        computeRspFactor();
      }
      dbInstance.insertTestResult(callUrl, callResult, respTime, res.statusCode, thisTester.created.valueOf());

      function computeRspFactor() {
        if (respTime <= slowTimeLimit) {
          callResult = callResult + .33;
          if (respTime <= mediumTimeLimit) {
            callResult = callResult + .33;
            if (respTime <= fastTimeLimit) {
              callResult = callResult + .34;
            }
          }
        }
      }
    });
  }
}

module.exports = Tester;

