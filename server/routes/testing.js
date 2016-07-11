/**
 * Created by jsunthon on 7/8/2016.
 */
var TestDbManager = require('../database/managers/TestDb.js');
var Tester = require('../logic/tester.js');

/**
 * This anonymous function that contains all the routes related
 * to manual testing
 * @param app
 *            app from app = express(); in server.js; provideded upon server start up
 */
module.exports = function(app) {
    var testDbInst = TestDbManager;
    var test = new Tester();
    /**
     * Get the list of all functions and their services
     */
    app.get('/api/getAllFunctions', function (req, res) {
        testDbInst.getAllFunctions().then(function(response) {
            res.send(response);
        })
    });

    /**
     * Get the list of all services
     */
    app.get('/api/getAllServices', function (req, res) {
        testDbInst.retrieveServiceListIPromise().then(function(response) {
            res.send(response);
        });
    });

    // Test a function
    app.post('/api/testFunction', function (req, res) {
        var functionObj = req.body;
        test.testServices(functionObj.services, "testFunction").then(function(testResults) {
            res.send(testResults);
        });
    });

    // Test a service
    app.post('/api/testService', function (req, res) {
        var serviceObj = req.body;
        test.testService(serviceObj).then(function(response){
            res.send(JSON.stringify(response));
        });
    });

    /**
     * Test all the services
     */
    app.post('/api/testAllServices', function (req, res) {
        var servicesArr = req.body.services;
        test.testServices(servicesArr).then(function(testResults) {
            var successes = testResults.filter(function(testResult) {
                return testResult.result === 3;
            });
            var failures = testResults.filter(function(testResult) {
                return testResult.result < 3;
            });
            res.send((JSON.stringify({successes : successes, failures: failures})));
        });
    });
}