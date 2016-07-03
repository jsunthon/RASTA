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

  /**
   * Initiates a call to testAllService() in the dbManager, which will use
   * makeApiCall() as a callback to call on every service
   */
  this.startScheduledTests = function () {
    dbInstance.testAllService(this.makeScheduledApiCall, this);
  };

  this.testFunction = function(funcObj, res) {
    var testDate = new Date();
    var servicesArr = funcObj.services;
    var promises = [];
    for (var i in servicesArr) {
      promises.push(this.makeManualApiCall(servicesArr[i], testDate));
    }

    Promise.all(promises).then(function(testResults) {
      res.send(testResults);
    }).catch(function(err) {
      res.send(err);
    });
  }

  this.testService = function(serviceObj, res) {
    var testDate = new Date();
    this.makeManualApiCall(serviceObj, testDate).then(function(result) {
        res.send(JSON.stringify(result));
      }, function(err, statusCode) {
        res.send(JSON.stringify({success: false, statusCode: statusCode}));
      });
  }

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

      superagent(httpMethod, callUrl).end(function (err, res) {
        var endTime = new Date().valueOf();
        respTime = endTime - startTime;
        if (err || res.statusCode !== 200) {
          console.log("Didn't get a response");
          reject(Error("No response"), res.statusCode);
        }
        else {
          var curResType = res.type;
          var targetResType = callObj.response_type;
          if (curResType !== targetResType) {
            computeRspFactor();
          }
          else {
            callResult++;
            computeRspFactor();
          }
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
        dbInstance.insertTestResult(callUrl, callResult, testDate.valueOf());

        var resultObj = {
          serviceName: callName,
          urlTested: callUrl,
          rspTime: respTime + " ms",
          expectedType: targetResType,
          receivedType: curResType,
          result: callResult,
          testDate : testDate.valueOf()
        }
        resolve(resultObj);
      });
    });
  }

  //this.testIndividualService = function()

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
        if (curResType !== targetResType) {
          computeRspFactor();
        }
        else {
          callResult++;
          computeRspFactor();
        }
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
      dbInstance.insertTestResult(callUrl, callResult, thisTester.created.valueOf());
    });
  }
}

module.exports = Tester;

