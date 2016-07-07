var superagent = require('superagent');
var parseXML = require('xml2js').parseString;
var bodyParser = require('body-parser');
var Tester = require('../test/tester');
var mongoose = require('mongoose');
var DB_manager = require('../db/db_manager');
var config = require('../config/database');

module.exports = function (app) {
  var test = new Tester();

  app.use(bodyParser.json());

  app.get('/api', function (req, res) {
    superagent
      .get('https://pub.lmmp.nasa.gov/LMMP/rest/dbxml/valsrvc/type/bbox?prjct=IAU2000:30100&type=pixelValue&ulat=-14.765625275432214&ulon=13.078125243954354&llat=-26.859375501024438&llon=25.171875469546578&iPlanetDirectoryPro=AQIC5wM2LY4SfcyaiHL%2Flh97yNQ0oWycMicJM3cFQnSu2E4%3D%40AAJTSQACMDE%3D%23')
      .end(function (err, result) {
        if (err || result.statusCode !== 200) {
          res.send(err);
        }
        else {
          parseXML(result.text, function (err, result) {
            if (err) {
              res.send(err);
            }
            else {
              res.json(result)
            }
          })
        }
      })
  });

  // Post request to upload service list
  app.post('/api/post_api_list', function (req, res) {
    var service_list = req.body;
    console.log(service_list);
    DB_manager.insertCalls(service_list, res);
  });

  /**
   * Retrive the overall service data for the Overall Service Status and Services
   * Availability tab.
   */
  app.get('/api/get_service_status', function (req, res) {
    DB_manager.retrieveOverallResults(res);
  });

  /**
   * Obtain a list of function names to populate the select tag in GUI
   */
  app.get('/api/getFuncNames', function(req, res) {
    DB_manager.retrieveFuncNames(res);
  });

  /**
   * Retrieve the function data when we select a particular function
   */
  app.get('/api/getFunctionData/:functionName', function(req, res) {
    DB_manager.retrieveFunctionResults(req.params.functionName, res);
  });

  /**
   * Obtain a list of service names of a particular function to
   * populate the select tag in GUI
   */
  app.get('/api/getFuncServNames/:functionName', function(req, res) {
    DB_manager.retrieveFuncServNames(req.params.functionName, res);
  });

  /**
   * Retrieve the function service data when we select a particular service
   * of a function
   */
  app.get('/api/getFuncServData/:funcServName', function(req, res) {
    DB_manager.retrieveFuncServData(req.params.funcServName, res);
  });

  /**
   * Given a function name retrieve the services
   */
  app.get('/api/get_service_status_by_function/:function_name', function (req, res) {
    console.log(req.params.function_name);
    DB_manager.retrieveFunctionResult(req.params.function_name, res);
  });

  app.get('/api/getAvailByDate/:date', function(req, res) {
    DB_manager.retrieveServAvailByDate(req.params.date).then(function(response) {
      console.log(response);
      res.send(JSON.stringify(response));
    }).catch(function(err) {
      console.log(err);
      if (!err.validDate) {
        err.message = "Invalid Date";
        res.send(JSON.stringify(err));
      }
      if (!err.resultsFound) {
        err.message = "No results found for that date.";
        res.send(JSON.stringify(err));
      }
    });
  });

  app.get('/api/getAllFunctions', function(req, res) {
    DB_manager.getAllFunctions(res);
  });

  app.get('/api/getAllServices', function(req, res) {
    DB_manager.getAllServices(res);
  });

  app.get('/api/getTickets', function (req, res) {
    var promise = DB_manager.retrieveTickets();
    promise.then(function (tickets) {
      res.send(JSON.stringify(tickets));
    })
  });
  
  app.get('/api/closeTicket/:id', function (req, res) {
      DB_manager.closeATicket(req.params.id)
        .then(function(code){
          console.log(code);
          res.sendStatus(code)
        });
  });

  //end-point for testing a function
  app.post('/api/testFunction', function(req, res) {
    var functionObj = req.body;
    test.testServices(functionObj.services, res, "testFunction");
  });

  //end-point for testing a service
  app.post('/api/testService', function(req, res) {
    var serviceObj = req.body;
    test.testService(serviceObj, res);
    //res.send("hello");
  });
  
  app.post('/api/testAllServices', function(req, res) {
    var servicesArr = req.body.services;
    // { failures: [{}, {}, {}], successes: [{}, {}, {}] }
    test.testServices(servicesArr, res, "testAllServices");
  });

  app.post('/api/getTicketData', function(req, res) {
    var issuesArr = req.body.issues;
    
    res.send("hello");
  });

  //// The following request types are not currently used
  //app.get('/api/get_service_status_by_function/:function_name/:keyword', function (req, res) {
  //  var function_name = req.params.function_name;
  //  var keyword = req.params.keyword;
  //  var services =
  //  {
  //    'services': [
  //      {
  //        'name': keyword,
  //        'status': {
  //          "labels": ['2015-08-01', '2015-09-01', '2015-10-01', '2015-11-01', '2015-12-01', '2016-01-01',
  //            '2016-02-01', '2016-03-01', '2016-04-01', '2016-06-01', '2016-06-01'],
  //          'data': [.3, .4, .6, .75, .7, .55, .8, .95, .85, .9, .5]
  //        }
  //      },
  //      {
  //        'name': keyword + '1',
  //        'status': {
  //          "labels": ['2015-08-01', '2015-09-01', '2015-10-01', '2015-11-01', '2015-12-01', '2016-01-01',
  //            '2016-02-01', '2016-03-01', '2016-04-01', '2016-06-01', '2016-06-01'],
  //          'data': [.5, .45, .65, .45, .75, .5, .85, .9, .6, .8, .35]
  //        }
  //      }
  //    ],
  //    'more': false
  //  };
  //  res.send(JSON.stringify(services));
  //});
  //
  //app.get('/api/get_service_status/:keyword', function (req, res) {
  //  var keyword = req.params.keyword;
  //  var services =
  //  {
  //    'services': [
  //      {
  //        'name': keyword,
  //        'status': {
  //          "labels": ['2015-08-01', '2015-09-01', '2015-10-01', '2015-11-01', '2015-12-01', '2016-01-01',
  //            '2016-02-01', '2016-03-01', '2016-04-01', '2016-06-01', '2016-06-01'],
  //          'data': [.3, .2, .35, .45, .75, .35, .65, .75, .5, .85, .6]
  //        }
  //      },
  //      {
  //        'name': keyword + '1',
  //        'status': {
  //          "labels": ['2015-08-01', '2015-09-01', '2015-10-01', '2015-11-01', '2015-12-01', '2016-01-01',
  //            '2016-02-01', '2016-03-01', '2016-04-01', '2016-06-01', '2016-06-01'],
  //          'data': [.4, .6, .35, .45, .75, .5, .85, .7, .6, .5, .45]
  //        }
  //      }
  //    ],
  //    'more': false
  //  };
  //  res.send(JSON.stringify(services));
  //});
  //
  //app.get('/api/get_function_status/:keyword', function (req, res) {
  //  DB_manager.retrieveFunctionResults(req.params.keyword, res);
  //});
}