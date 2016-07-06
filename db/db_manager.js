var mongoose = require('mongoose');
var APICall = require('./models/api_call');
var APIFunction = require('./models/api_function');
var TestResult = require('./models/test_result');
var IssueTicket = require('./models/issue_ticket');
var config = require('../config/database');
var moment = require('moment');

function DBManager(connection_string) {
  if (mongoose.connection.readyState == 0) {
    mongoose.connect(connection_string);
  }

  mongoose.Promise = Promise;
  var db = mongoose.connection; //reference to the current mongodb connection
  db.once('error', console.error.bind(console, 'connection error')); //event handler; if error, do tell.

  // DB writers

  this.insertCalls = function (service_list, res) {
    if (db.readyState !== 1 && db.readyState !== 3) {
      db.once('connected', insert);
    } else if (db.readyState === 1) {
      insert();
    }
    function insert() {
      if (service_list.hasOwnProperty('services')) {
        insertCall(service_list.services, service_list.functions, res);
      }
    }
  };

  /**
   * Saves the results of a service api test to the database
   * @param call_url
   *                The URL of the service
   * @param call_result
   *                 1 if successful, 0 if not.
   * @param epoch_seconds
   *                Unix time in seconds since Jan 1, 1970
   */
  this.insertTestResult = function (call_url, call_result, response_time, status_code, epoch_seconds) {
    return new Promise(function (resolve, reject) {
      if (db.readyState === 1) {
        APICall.findOne({url: call_url}, function (err, found_call) {
          if (err) return console.error(err);
          if (found_call == null) return console.error('call not found');
          else {
            var test_result = new TestResult(
              {
                service_id: found_call._id,
                service_name: found_call.name,
                test_result: call_result,
                test_date: epoch_seconds,
                status_code: status_code,
                response_time: response_time
              }
            );
            test_result.save(function (err, saved_result) {
              if (err) return console.error(err);
              resolve();
              //console.log("test result with id: " + saved_result._id + "has been saved");
            });
          }
        });
      }
    });
  };

  this.insertTickets = function (test_results) {
    //console.log(test_results.)
    var promise = test_results.map(function (test_result) {
      return new Promise(function (resolve, reject) {
        if (test_result.result < 3) {
          TestResult.findOne(
            {
              service_name: test_result.serviceName,
              test_date: test_result.testDate.valueOf()
            },
            function (err, found_one) {
              if (err) return console.error(err);
              resolve(found_one._id);
            }
          );
        }
      });
    });
    Promise.all(promise).then(function (unsuccessful_ids) {
      var ticket = new IssueTicket({
        open_date: test_results[0].testDate,
        issues: unsuccessful_ids
      });
      ticket.save(function (err) {
        if (err) console.error(err);
      })
    })
  };

  // DB readers

  /**
   * Retrieve list of all services as a promise
   *
   * Returns: a promise for the service list
   * call result.then(function(services){}) to perform tasks on services
   */
  this.retrieveServiceListIPromise = function () {
    var promise = APICall.find({}).exec();
    return promise;
  };

  this.retrieveServAvailByDate = function (date) {
    var start = moment(date).startOf('day');
    var end = moment(start).add(1, 'days');
    console.log(end);
    return new Promise(function (resolve, reject) {
      TestResult.find({
        "test_date": {
          $lt: end,
          $gt: start
        }
      }, function (err, results) {
        if (err) {
          reject({validDate: false});
        }
        else {
          if (results.length !== 0) {
            var totalRes = results.reduce(function (prev, curr) {
              return {test_result: prev.test_result + curr.test_result};
            });
            var divisor = 3 * results.length;
            var avail = (totalRes.test_result / divisor) * 100;
            var unavail = 100 - avail;
            resolve({validDate: true, resultsFound: true, avail: avail, unavail: unavail});
          } else {
            reject({validDate: true, resultsFound: false});
          }
        }
      });
    });
  };

  this.retrieveFuncNames = function (res) {
    APIFunction.aggregate(
      [
        {
          $sort: {
            name: 1
          }
        },
        {
          $project: {
            "_id": 0,
            name: 1,
            services: 1
          }
        }
      ], function (err, results) {
        res.send(JSON.stringify(results));
      }
    );
  }

  this.retrieveFuncServNames = function (functionName, res) {
    APIFunction.aggregate(
      [
        {
          $match: {
            name: functionName
          }
        },
        {
          $unwind: "$services"
        },
        {
          $lookup: {
            from: "apicalls",
            localField: "services",
            foreignField: "_id",
            as: "service"
          }
        },
        {
          $sort: {
            services: -1
          }
        }
      ], function (err, results) {
        resultsArr = results.map(function (result) {
          return {
            name: result.service[0].name,
            testUrl: result.service[0].url
          };
        });
        res.send(JSON.stringify(resultsArr));
      });
  }

  /**
   * Return data for overall service availability
   * @param res
   */
  this.retrieveOverallResults = function (res) {
    if (db.readyState !== 1 && db.readyState !== 3) {
      db.once('connected', retrieveResults);
    } else if (db.readyState === 1) {
      retrieveResults();
    }
    function retrieveResults() {
      TestResult.aggregate(
        [
          {
            "$group": {
              _id: "$test_date",
              testresults: {$sum: "$test_result"},
              count: {$sum: 1}
            }
          },
          {
            $sort: {
              '_id': 1
            }
          }
        ],
        function (err, results) {
          var statusRes = generateStatResWith10ItemsPerArray(results);
          res.send(JSON.stringify(statusRes));
        }
      );
    };
  };

  /**
   * Get the data for a particular function.
   * @param res
   */
  this.retrieveFunctionResults = function (name, res) {
    APIFunction.aggregate([
      {
        $match: {
          name: name
        }
      },
      {
        $unwind: "$services"
      },
      {
        $lookup: {
          from: 'testresults',
          localField: "services",
          foreignField: "service_id",
          as: "data"
        }
      },
      {
        $unwind: "$data"
      }, {
        $group: {
          _id: "$data.test_date",
          testresults: {$sum: "$data.test_result"},
          count: {$sum: 1}
        }
      },
      {
        $sort: {
          '_id': 1
        }
      }
    ], function (err, results) {
      if (err) return console.error(err);
      else {
        var statusRes = generateStatResWith10ItemsPerArray(results);
        res.send(JSON.stringify(statusRes));
      }
    });
  };

  /**
   * Get the data for the service of a particular function
   * @param funcServName
   * @param res
   */
  this.retrieveFuncServData = function (funcServName, res) {
    TestResult.aggregate(
      [
        {
          $match: {
            service_name: funcServName
          }
        },
        {
          "$group": {
            _id: "$test_date",
            testresults: {$sum: "$test_result"},
            count: {$sum: 1}
          }
        },
        {
          $sort: {
            '_id': 1
          }
        }
      ], function (err, results) {
        if (err) return console.error(err);
        else {
          var statusRes = generateStatResWith10ItemsPerArray(results);
          res.send(JSON.stringify(statusRes));
        }
      }
    );
  };

  /**
   * Retieve tickets created on the current day
   * @returns {Promise} a promise of an array of tickets
   */
  this.retrieveTickets = function () {
    return new Promise(function (resolve, reject) {
      var today = new Date();
      IssueTicket.find(
        {
          open_day: today.getDate(),
          open_month: today.getMonth() + 1,
          open_year: today.getFullYear()
        },
        function (err, found_tickets) {
          if (err) console.error(err);
          console.log(found_tickets);
          resolve(found_tickets);
        }
      )
    })
  };

  // Misc

  /**
   * For an array of services, execute a function (API call) until you have no more calls
   * @param calls Array of services
   * @param testCallback Callback function to execute
   */
  var testService = function (calls, testCallback) {
    if (calls[0] != null) {
      var cur_call = calls.pop();
      APICall.findOne({_id: cur_call}, function (err, found_call) {
        if (err) return console.error(err);
        if (found_call == null) return console.error('call not found');
        else {
          testCallback(found_call.url);
        }
      });
      testService(calls, testCallback);
    }
  };

  /**
   * Used to test exactly one function
   * @param function_name Name of the function to test
   * @param testCallback Function that makes the API call for the service. It is a callback
   */
  this.testFunction = function (function_name, testCallback) {
    if (db.readyState !== 1 && db.readyState !== 3) {
      db.once('connected', findTestFunc);
    } else if (db.readyState === 1) {
      findTestFunc();
    }

    function findTestFunc() {
      APIFunction.findOne({name: function_name}, function (err, found_function) {
        if (err) return console.error(err);
        if (found_function == null) return console.error('function not found');
        else {
          testService(found_function.services, testCallback);
        }
      });
    }
  };

  /**
   * Helper method that generates exactly 10 results from an array of result objects.
   * Used for data in the graphs.
   * @param results
   * @returns {{labels: (Array|*), data: (Array|*)}}
   */
  function generateStatResWith10ItemsPerArray(results) {
    var tenIndices = [];
    for (var i = 1; i <= 10; i++) {
      var idx = Math.ceil(results.length / 10 * i - 1);
      tenIndices.push(idx);
    }
    var tenRes = results.filter(function (result) {
      var resultIndex = results.indexOf(result);
      return tenIndices.indexOf(resultIndex) > -1;
    });
    tenRes = tenRes.map(function (result) {
      var finalRes = result.testresults / (3 * result.count);
      result.testresults = finalRes;
      return result;
    });
    var statusRes = {
      "labels": tenRes.map(function (result) {
        return result._id;
      }),
      "data": tenRes.map(function (result) {
        return result.testresults;
      })
    }
    return statusRes;
  }

  this.getAllFunctions = function (res) {
    APIFunction.aggregate([
      {
        $unwind: "$services"
      },
      {
        $lookup: {
          from: 'apicalls',
          localField: "services",
          foreignField: "_id",
          as: "services"
        }
      },
      {
        $group: {
          _id: "$name",
          id: {
            $first: "$_id"
          },
          services: {$addToSet: "$services"}
        }
      }
    ], function (err, results) {
      if (err) return console.error(err);
      else {
        console.log(JSON.stringify(results));
        res.send(results);
      }
    });
  }

  this.getAllServices = function (res) {
    APICall.find({}).exec(function (error, results) {
      res.send(results);
    });
  }

  var insertCall = function (calls, functions, res) {
    if (calls[0] != null) {
      var call = calls.pop();
      APICall.findOne({name: call.name}, function (err, found_call) {
        if (err) return console.error(err);
        if (found_call == null) {
          var call_obj = new APICall(call);
          call_obj.save(function (err, saved_call) {
            if (err) return console.error(err);
            //console.log("Call with id:" + saved_call._id + " has been saved");
            insertCall(calls, functions, res);
          });
        }
        else {
          insertCall(calls, functions, res);
        }
      });
    }
    else {
      insertFunction(functions, res);
    }
  };

  var insertFunction = function (functions, res) {
    if (res !== undefined) {
      //console.log("Res is from insertFunction: " + res);
    }
    if (functions[0] != null) {
      var cur_function = functions.pop();
      insertFunctionWithCalls(cur_function, cur_function.services, functions, res);
    }
    else {
      APICall.find(function (err, found_calls) {
        //console.log("Res is from outer callback: " + res);
        if (err) return console.error(err);
        var res_obj = {services: found_calls};
        APIFunction.find(function (err, found_functions) {
          //console.log("Res is from inner callback: " + res);
          res_obj.functions = found_functions;
          res.send(JSON.stringify(res_obj));
          //mongoose.disconnect();
        })
      })
    }
  };

  var insertFunctionWithCalls = function (cur_function, calls, functions, res) {
    if (calls[0] != null) {
      var cur_call = calls.pop();
      APIFunction.findOne({name: cur_function.name}, function (err, found_function) {
        if (err) return console.error(err);
        APICall.findOne({name: cur_call.name}, function (err, found_call) {
          if (err) return console.error(err);
          if (found_call == null) {
            var call_obj = new APICall(cur_call);
            call_obj.save(function (err, saved_call) {
              if (err) return console.error(err);
              insertFunctionWithOneCall(cur_function, calls, functions, saved_call._id, found_function, res);
            });
          }
          else {
            insertFunctionWithOneCall(cur_function, calls, functions, found_call._id, found_function, res);
          }
        });
      })
    }
    else {
      insertFunction(functions, res);
    }
  };

  var insertFunctionWithOneCall = function (cur_function, calls, functions, id, found_function, res) {
    if (found_function == null) {
      var function_obj = new APIFunction({
        name: cur_function.name,
        critical_level: cur_function.critical_level,
        services: [id]
      });
      function_obj.save(function (err, saved_function) {
        if (err) return console.error(err);
        //console.log("Function with id: " + saved_function._id + " has been saved");
        insertFunctionWithCalls(cur_function, calls, functions, res);
      });
    }
    else {
      var function_calls = found_function.services;
      if (id != null && function_calls.indexOf(id) == -1) {
        function_calls.push(id);
      }
      APIFunction.update({_id: found_function._id}, {$set: {services: function_calls}}, function (err, updated_function) {
        if (err) return console.error(err);
        console.log("Function with id: " + found_function._id + " has been updated");
        insertFunctionWithCalls(cur_function, calls, functions, res);
      })
    }
  };

  // Currently not used
  /**
   * Get all the services in the DB, and call a function for each of them.
   * In this case, we are making an API call for each services
   * @param testCallback
   *                      The callback function to execute for each service
   * @param scope
   *                      Reference to the current instance of Tester();
   */
  this.testAllService = function (testCallback, scope) {
    //console.log("Ready state of db connection: " + db.readyState);
    if (db.readyState !== 1 && db.readyState !== 3) {
      //once 'connected' event is emitted, db.readyState = 1
      db.once('connected', findAllCall);
    } else if (db.readyState === 1) {
      findAllCall();
    }

    function findAllCall() {
      APICall.find({}, function (err, found_calls) {
        if (err) return console.error(err);
        testEveryService(found_calls, testCallback, scope);
      });
    }
  };
  this.testOneService = function (call_name, testCallback) {
    APICall.findOne({name: call_name}, function (err, found_call) {
      if (err) return console.error(err);
      if (found_call == null) return console.error('call not found');
      else {
        testCallback(found_call.url);
        mongoose.disconnect();
      }
    });
  };
  /**
   * Helper function for this.testAllService. Make API calls until you have no more.
   * @param calls
   *              List of services
   * @param testCallback
   *              The callback function to execute for each service
   * @param scope
   *              Reference to the current Tester() function
   */
  var testEveryService = function (calls, testCallback, scope) {
    if (calls[0] != null) {
      var cur_call = calls.pop();
      //console.log("About to do make api call for: " + cur_call.url);
      testCallback(cur_call, scope);
      testEveryService(calls, testCallback, scope);
    }
  };
}

module.exports = new DBManager(config.database);