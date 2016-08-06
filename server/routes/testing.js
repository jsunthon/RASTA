/**
 * Created by jsunthon on 7/8/2016.
 */
var TestDbManager = require('../database/managers/TestDb.js');
var Tester = require('../logic/Tester.js');
var ServiceDbManager = require('../database/managers/ServiceDb.js');
var uuid = require('node-uuid');
/**
 * This anonymous function that contains all the routes related
 * to manual testing
 * @param app
 *            app from app = express(); in server.js; provideded upon server start up
 */
module.exports = function (app) {
  var testDbInst = TestDbManager;
  var testInstances =  {};

  /**
   * Get the list of all functions and their services
   */
  app.get('/api/getAllFunctions', function (req, res) {
    testDbInst.getAllFunctions().then(function (response) {
      res.send(response);
    })
  });

  /**
   * Get the list of all services
   */
  app.get('/api/getAllServices', function (req, res) {
    testDbInst.retrieveServiceListIPromise().then(function (response) {
      res.send(response);
    });
  });

  app.get('/api/getAllServices/:skip', function (req, res) {
    var skip = req.params.skip;
    testDbInst.retrieveTenServices(skip).then(function (response) {
      res.send(response);
    });
  });

  // Test a function
  app.post('/api/testFunction', function (req, res) {
    var functionObj = req.body;
    var test = new Tester();
    test.testServices(functionObj.services).then(function (lastTestResult) {
      var testResults = test.getTestResults();
      testResults.push(lastTestResult);
      res.send(testResults);
    });
  });

  // Test a service
  app.post('/api/testService', function (req, res) {
    var serviceObj = req.body;
    var test = new Tester();
    test.testService(serviceObj).then(function (response) {
      res.send(JSON.stringify(response));
    });
  });

  /**
   * Get a count of all the services prior to testing.
   */
  app.get('/api/getServiceCount', function(req, res) {
    ServiceDbManager.getServiceCount().then(function(count) {
      res.json({count: count});
    });
  });

  /**
   * Generate a unique id for a test
   */
  app.get('/api/testAllServices/genTestId', function(req, res) {
    var uniqId = uuid.v1();
    res.send(uniqId);
  });

  /**
   * Test all the services
   */
  app.get('/api/testAllServices/:uniqueId', function (req, res) {
    var uniqueId = req.params.uniqueId;
    if (!testInstances[uniqueId]) {
      var tester = new Tester();
      testInstances[uniqueId] = tester;

      testDbInst.retrieveServiceListIPromise().then(function (services) {
        tester.testServices(services, "testAllServicesManually").then(function (lastTestRes) {
          var testResults = tester.getTestResults();
          testResults.push(lastTestRes);
          var successes = testResults.filter(function (testResult) {
            if (testResult) {
              return testResult.result >= 1;
            }
          });
          var failures = testResults.filter(function (testResult) {
            if (testResult) {
              return testResult.result <= 1;
            }
          });
          delete testInstances[uniqueId];
          res.send((JSON.stringify({successes : successes, failures: failures})));
        }).catch(function(err) {
          res.json(err);
        });
      });
    } else {
      res.send(JSON.stringify({errorMsg: "Test already in progress."}));
    }
  });

  /**
   * Get currently test service in order to display the status
   */
  app.get('/api/getCurrentlyTestedServices/:uniqueId', function (req, res) {
    var uniqueId = req.params.uniqueId;
    if (testInstances[uniqueId]) {
      var testInst = testInstances[uniqueId];
      return res.json(testInst.getServiceStatus());
    } else {
      return res.json({errorMsg: "Invalid test id."});
    }
  });
}