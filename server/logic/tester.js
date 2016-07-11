var superagent = require('superagent');
var TestDbManager = require('../database/managers/TestDb.js');
var TicketDbManager = require('../database/managers/TicketDb.js');
var db = require('../database/managers/dbInit').goose;

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

// Class that enables us to do scheduled and manual tests
function Tester() {
  var self = this;
  var testDbInst = TestDbManager;
  var ticketDbInst = TicketDbManager;
  var fastTimeLimit = 1000;
  var mediumTimeLimit = 2500;
  var slowTimeLimit = 5000;

    /**
     * Get all the services, then test all the services. Insert tickets if necessary.
     */
  this.startScheduledTests = function () {
    testDbInst.retrieveServiceListIPromise().then(function (services) {
      try {
        self.testServices(services).then(function(testResults) {
          ticketDbInst.insertTickets(testResults);
        });
      } catch(err) {
        console.error(err);
      }
    });
  };

    /**
     * For all the services, return a promise to test them all
     * @param services
     *               Array of service objs to test
     * @returns {Route|*|Promise|app}
     */
  this.testServices = function(services) {
      var testDate = new Date();
      var promises = [];
      for (var i in services) {
        promises.push(this.makeManualApiCall(services[i], testDate));
      }
      return Promise.all(promises);
  };

    /**
     * Test a single service
     * @param serviceObj
     *                  an instance of APICall
     * @returns {*}
     */
  this.testService = function(serviceObj) {
    var testDate = new Date();
    return this.makeManualApiCall(serviceObj, testDate);
  };

    /**
     * Make exactly one api call, and save the results of it.
     * @param callObj
     *               an instance of APICall. Extract url to test
     * @param testDate
     *               Date of the test
     * @returns {Promise}
     */
  this.makeManualApiCall = function (callObj, testDate) {
    return new Promise(function(resolve, reject) {
      var callName = callObj.name;
      var callUrl = callObj.url;
      var targetResType = callObj.response_type;
      var callResult = 1; //assume no response
      var httpMethod = callObj.type.toUpperCase();
      var respTime = 0;
      var startTime = new Date().valueOf();

      var resultObj = {
        serviceName: callName,
        urlTested: callUrl,
        result: callResult,
        expectedType: targetResType,
        testDate : testDate.valueOf()
      };

      superagent(httpMethod, callUrl).end(function (err, res) {
        resultObj.statCode = res.statusCode;
        var endTime = new Date().valueOf();
        respTime = endTime - startTime;
        if (err || res.statusCode !== 200) {
          resultObj.rspTime = "FAIL";
          resultObj.receivedType = "FAIL";
        }
        else {
          var curResType = res.type;
          if (curResType === targetResType) {
            callResult++;
          }
          callResult = computeRspFactor(respTime, callResult);
            resultObj.rspTime = respTime + " ms";
            resultObj.receivedType = curResType;
            resultObj.result = callResult;
        }

        testDbInst.insertTestResult(
            resultObj.urlTested,
            resultObj.result,
            respTime,
            res.statusCode,
            resultObj.testDate).then(function () {resolve(resultObj);
        });
      });
    });
  };

    /**
     * Helper function to compute the call result of a given test
     * @param respTime
     *                 Response time of the api call
     * @param callResult
     *                 Final computed result
     * @returns {*}
     */
  function computeRspFactor(respTime, callResult) {
    if (respTime <= slowTimeLimit) {
      callResult = callResult + .33;
      if (respTime <= mediumTimeLimit) {
        callResult = callResult + .33;
        if (respTime <= fastTimeLimit) {
          callResult = callResult + .34;
        }
      }
    }
    return callResult;
  }
}

module.exports = Tester;

