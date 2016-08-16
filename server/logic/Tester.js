var superagent = require('superagent');
var TestDbManager = require('../database/managers/TestDb.js');
var TicketDbManager = require('../database/managers/TicketDb.js');
var db = require('../database/managers/dbInit').goose;
var request = require('request').defaults({jar: true});
var xml2json = require('xml2js').parseString;

/** callResult :
 0 - No Response

 // Incorrect type
 .33 - slow
 .66 - medium
 1 - fast

 // Correct type
 1.33 - slow
 1.66 - medium
 2 - fast
 **/

// Class that enables us to do scheduled and manual tests
function Tester() {
  var self = this;
  var testDbInst = TestDbManager;
  var ticketDbInst = TicketDbManager;
  var serviceTestStatus = {num: 1};
  var testResults = [];
  var counter = 0;
  /**
   * Get all the services, then test all the services. Insert tickets if necessary.
   */
  this.startScheduledTests = function () {
    console.log('Starting test...');
    testDbInst.retrieveServiceListIPromise().then(function (services) {
      try {
        self.testServices(services).then(function () {
          ticketDbInst.insertTickets(testResults);
        }).catch(function (err) {
          console.log(JSON.stringify(err));
        });
      } catch (err) {
        console.error(err);
      }
    });
  };

  this.getServiceStatus = function () {
    return serviceTestStatus;
  };

  this.getTestResults = function () {
    return testResults;
  }

  /**
   * For all the services, return a promise to test them all
   * @param services
   *               Array of service objs to test
   * @returns {Route|*|Promise|app}
   */
  this.testServices = function (services) {
    if (services.length > 0) {
      serviceTestStatus.total = services.length;
      var h = arguments[1];
      var testDate = new Date();

      if (h !== undefined) {
        return services.reduce(function (p, service) {
          return p.then(function (testResult) {
            if (testResult) {
              testResults.push(testResult);
            }
            return self.makeManualApiCall(service, testDate, "testAllServicesManually");
          });
        }, Promise.resolve());
      } else {
        return services.reduce(function (p, service) {
          return p.then(function (testResult) {
            if (testResult) {
              testResults.push(testResult);
            }
            return self.makeManualApiCall(service, testDate);
          });
        }, Promise.resolve());
      }
    } else {
      return Promise.reject({noServices: true});
    }
  };

  /**
   * Test a single service
   * @param serviceObj
   *                  an instance of APICall
   * @returns {*}
   */
  this.testService = function (serviceObj) {
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
    var h = arguments[2];
    var offset = callObj.time_out / 3;
    var fastTimeLimit = offset;
    var mediumTimeLimit = offset * 2;
    var slowTimeLimit = callObj.time_out;

    return new Promise(function (resolve, reject) {
      var callName = callObj.name;
      var callUrl = callObj.url;
      var targetResType = callObj.response_type;
      var callResult = 0;
      var respTime = 0;
      var startTime = new Date().valueOf();
      var expectedResponse = callObj.expectedResponse;

      var resultObj = {
        serviceName: callName,
        urlTested: callUrl,
        result: callResult,
        expectedType: targetResType,
        testDate: testDate.valueOf()
      };

      if (detIfNeedRspCont(resultObj.expectedType)) {
        resultObj.expectedResponse = expectedResponse;
      }

      serviceTestStatus.urlTested = resultObj.urlTested;

      request({method: callObj.type, uri: callUrl, timeout: callObj.time_out}, function (err, res, body) {
        if (h !== undefined) {
          if (serviceTestStatus.num < serviceTestStatus.total) {
            serviceTestStatus.num++;
          }
        }

        var endTime = new Date().valueOf();
        respTime = endTime - startTime;

        resultObj.rspTime = respTime;
        if (res && res.statusCode === 401) {
          authorizeRequest(callUrl).then(function (resp) {
            processTestResult(err, resp.res, resultObj, resp.body).then(function (resultObj) {
              resolve(resultObj);
            });
          });
        } else {
          processTestResult(err, res, resultObj, body).then(function (resultObj) {
            resolve(resultObj);
          });
        }
      });
    });


    function authorizeRequest(url) {
      var auth_promise = new Promise(function (resolve) {
        request.post('https://ops.lmmp.nasa.gov/opensso/UI/Login', {
          form: {
            IDToken1: 'lmmpdev',
            IDToken2: 'devlmmp'
          }
        }, function (err, res, body) {
          resolve()
        });
      });
      return new Promise(function (resolve) {
        auth_promise.then(function () {
          request.get(url, function (err, res, body) {
            resolve({res: res, body: body});
          })
        });
      });
    }

    function processTestResult(err, res, resultObj, body) {
      return new Promise(function (resolve, reject) {
        if (!err) {
          resultObj.statusCode = res.statusCode;
          resultObj.receivedType = res.headers["content-type"];
          if (resultObj.type === "unknown" || resultObj.receivedType.includes(resultObj.expectedType)) {
            resultObj.result++;
          }
        } else {
          resultObj.statusCode = 500;
          resultObj.receivedType = "FAIL";
        }

        if (resultObj.statusCode === 200) {
          if (resultObj.receivedType.includes('application/json')) {
            resultObj.receivedResponse = JSON.parse(body);
          }
          else if (resultObj.receivedType.includes('application/xml') || resultObj.receivedType.includes('text/xml')) {
            xml2json(body.deentitize(), {attrkey: '@'}, function (err, result) {
              resultObj.receivedResponse = result;
            });
          }
          resultObj.result = computeRspFactor(resultObj.rspTime, resultObj.result);
        }
        testDbInst.insertTestResult(resultObj).then(function () {
          resultObj.rspTime = resultObj.rspTime + " ms";
          resolve(resultObj);
        });
      });
    }

    /**
     * Helper function to compute the call result of a given test
     * @param respTime
     *                 Response time of the api call
     * @param callResult
     *                 Final computed result
     * @returns {*}
     */
    function computeRspFactor(respTime, callResult) {
      if (respTime < slowTimeLimit) {
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
  };

  /**
   * Get the response type of a url by running a test on it
   * @param call_method: request type
   * @param call_url: testing url
   * @returns {Promise of response type}
   */
  this.testForResType = function (call_method, call_url) {
    return new Promise(function (resolve) {
      superagent(call_method, call_url)
        .timeout(5000)
        .end(function (err, res) {
          //console.log(res);
          if (err) resolve("unknown");
          if (res === undefined) resolve("unknown");
          else resolve(res.type);
        });
    });
  }

  /**
   * Indicate if we need to store the response content depending on the content type
   * @param contentType
   * @returns {boolean}
   */
  function detIfNeedRspCont(contentType) {
    return contentType.includes('application/json') || contentType.includes('application/xml') || contentType.includes('text/xml');
  }

  String.prototype.deentitize = function () {
    var ret = this.replace(/&gt;/g, '>');
    ret = ret.replace(/&lt;/g, '<');
    ret = ret.replace(/&quot;/g, '"');
    ret = ret.replace(/&apos;/g, "'");
    ret = ret.replace(/&amp;/g, '&');
    return ret;
  };
}

module.exports = Tester;

