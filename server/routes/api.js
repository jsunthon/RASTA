var ChartDbManager = require('../database/managers/ChartDb.js');

/**
 * This anonymous function that contains all the routes related
 * to retrieving chart data on home page
 * @param app
 *            app from app = express(); in server.js; provided upon server start up
 */
module.exports = function (app) {

  var chartDbInst = ChartDbManager;

  /**
   * Retrive the overall service data for the Overall Service Status Section
   */
  app.get('/api/get_service_status', function (req, res) {
    chartDbInst.retrieveOverallResults().then(function (response) {
      res.send(response);
    });
  });

  /**
   * Given a date, retrieve overall service availability
   */
  app.get('/api/getAvailByDate/:date', function (req, res) {
    chartDbInst.retrieveServAvailByDate(req.params.date).then(function (response) {
      res.send(response);
    }).catch(function (err) {
      if (!err.validDate) {
        err.message = "Invalid Date";
      }
      if (!err.resultsFound) {
        err.message = "No results found for that date.";
      }
      res.send(JSON.stringify(err));
    });
  });

  /**
   * Obtain a list of function names to populate the select tag in GUI
   */
  app.get('/api/getFuncNames', function (req, res) {
    chartDbInst.retrieveFuncNames().then(function (response) {
      res.send(response);
    });
  });

  /**
   * Obtain a list of service names of a particular function to
   * populate the select tag in GUI
   */
  app.get('/api/getFuncServNames/:functionName', function (req, res) {
    chartDbInst.retrieveFuncServNames(req.params.functionName)
      .then(function (response) {
        res.send(response);
      })
  });

  /**
   * Retrieve the function data when we select a particular function
   */
  app.get('/api/getFunctionData/:functionName', function (req, res) {
    chartDbInst.retrieveFunctionResults(req.params.functionName)
      .then(function (response) {
        res.send(response);
      });
  });

  /**
   * Retrieve the function service data when we select a particular service
   * of a function
   */
  app.get('/api/getFuncServData/:funcServName', function (req, res) {
    chartDbInst.retrieveFuncServData(req.params.funcServName)
      .then(function (response) {
        res.send(response);
      });
  });
};