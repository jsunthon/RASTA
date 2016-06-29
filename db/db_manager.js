var mongoose = require('mongoose');
var APICall = require('./models/api_call');
var APIFunction = require('./models/api_function');
var TestResult = require('./models/test_result');
var config = require('../config/database')

function DBManager(connection_string) {
  if (mongoose.connection.readyState == 0) {
    mongoose.connect(connection_string);
  }

  var db = mongoose.connection; //reference to the current mongodb connection
  db.on('error', console.error.bind(console, 'connection error')); //event handler; if error, do tell.
  
  /**
   * Get all the services in the DB, and call a function for each of them.
   * In this case, we are making an API call for each services
   * @param testCallback
   *                      The callback function to execute for each service
   * @param scope
   *                      Reference to the current instance of Tester();
   */
  this.testAllService = function (testCallback, scope) {
    console.log("Ready state of db connection: " + db.readyState);
    if (db.readyState !== 1 && db.readyState !== 3) {
      //once 'connected' event is emitted, db.readyState = 1
      db.on('connected', findAndCall);
    } else if (db.readyState === 1) {
      findAndCall();
    }

    function findAndCall() {
      APICall.find({}, function (err, found_calls) {
        if (err) return console.error(err);
        testEveryService(found_calls, testCallback, scope);
      });
    }
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
      console.log("About to do make api call for: " + cur_call.url);
      testCallback(cur_call, scope);
      testEveryService(calls, testCallback, scope);
    }
  }

  /**
   * Saves the results of a service api test to the database
   * @param call_url
   *                The URL of the service
   * @param call_result
   *                 1 if successful, 0 if not.
   * @param epoch_seconds
   *                Unix time in seconds since Jan 1, 1970
   */
  this.insertTestResult = function (call_url, call_result, epoch_seconds) {
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
              test_date: epoch_seconds
            }
          );
          test_result.save(function (err, saved_result) {
            if (err) return console.error(err);
            console.log("test result with id: " + saved_result._id + "has been saved");
          });
        }
      });
    }
  };

  /**
   * For a particular service, retrive the results and return it as JSON
   * @param call_name
   *                  Name of the service
   * @param res
   *             Res obj to send json message through
   */
  this.retrieveCallResults = function (call_name, res) {
    if (db.readyState !== 1 && db.readyState !== 3) {
      db.on('connected', retrieveResults);
    } else if (db.readyState === 1) {
      retrieveResults();
    }

    function retrieveResults() {
      TestResult.find({name: call_name}, function (err, found_results) {
        if (err) return console.error(err);
        var labels = [];
        var data = [];
        for (var result_idx in found_results) {
          var result_call = found_results[result_idx];
          labels.push(result_call.test_date);
          data.push(result_call.test_result);
        }
        var status = {
          "labels": labels,
          "data": data / 2
        };
        res.send(JSON.stringify(status));
      });
    }
  };

  /**
   * Used to test exactly one function
   * @param function_name Name of the function to test
   * @param testCallback Function that makes the API call for the service. It is a callback
   */
  this.testFunction = function (function_name, testCallback) {
    if (db.readyState !== 1 && db.readyState !== 3) {
      db.on('connected', findTestFunc);
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

  // Respond the status of all function
  this.retrieveFunctionResults = function (res) {
    APIFunction.find(function (err, found_functions) {
      if (err) return console.error(err);
      retrieveOneFuntionResult(found_functions, res)
    });
    var function_results = [];
    function retrieveOneFuntionResult(functions, res) {
      if (functions[0] != null) {
        var current_function = functions.pop();
        console.log(JSON.stringify(current_function.services));
        TestResult.find({ service_id: { $in: current_function.services } }, function (err, found_results) {
          if (err) return console.error(err);
          var status = {};
          var max_service_count = 0;
          var service_count = 0;
          for (var result_idx in found_results) {
            var result = found_results[result_idx];
            if (status[result.test_date] == null) {
              status[result.test_date] = result.test_result;
              service_count = 1;
            }
            else {
              status[result.test_date] += result.test_result;
              service_count ++;
              if (service_count > max_service_count) max_service_count = service_count;
            }
          }
          var keys = Object.keys(status);
          var values = keys.map(function (key) {
            return status[key] / (3 * max_service_count);
          });
          var ten_keys = [];
          var ten_values = [];
          for (var i = 1; i <= 10; i++) {
            var idx = Math.ceil(keys.length / 10 * i - 1);
            ten_keys.push(keys[idx]);
            ten_values.push(values[idx]);
          }
          var status_result = {
            "labels": ten_keys,
            "data": ten_values
          };
          var function_result =
          {
            'name': current_function.name,
            'status': status_result
          };
          function_results.push(function_result);
          retrieveOneFuntionResult(functions, res);
        });
      }
      else {
        var response = {functions: function_results, more: false};
        console.log(JSON.stringify(function_results));
        res.send(JSON.stringify(response));
      }
    }
  };

  this.retrieveFunctionResult = function (function_name, res) {
    if (db.readyState !== 1 && db.readyState !== 3) {
      db.on('connected', retrieveResults);
    } else if (db.readyState === 1) {
      retrieveResults();
    }

    function retrieveResults() {
      APIFunction.findOne({name: function_name}, function (err, found_function) {
        if (err) return console.error(err);
        TestResult.find({_id: {$in: found_function.services}}, function (err, found_results) {
          if (err) return console.error(err);
          var status = {};
          for (var result_idx in found_results) {
            var result_call = found_results[result_idx];
            if (status[result_call.test_date] == null) {
              status[result_call.test_date] = result_call.test_result;
            }
            else {
              status[result_call.test_date] += result_call.test_result;
            }
          }
          var status_result = {
            "labels": Object.keys(status),
            "data": Object.values(status) / (2 * found_function.services.length)
          };
          res.send(JSON.stringify(status_result));
          mongoose.disconnect();
        });
      });
    }
  };

  this.retrieveOverallResults = function (res) {
    if (db.readyState !== 1 && db.readyState !== 3) {
      db.on('connected', retrieveResults);
    } else if (db.readyState === 1) {
      retrieveResults();
    }
    function retrieveResults() {
      TestResult.find(function (err, found_results) {
        if (err) return console.error(err);
        var status = {};
        var max_service_count = 0;
        var service_count = 0;
        for (var result_idx in found_results) {
          var result = found_results[result_idx];
          if (status[result.test_date] == null) {
            status[result.test_date] = result.test_result;
            service_count = 1;
          }
          else {
            status[result.test_date] += result.test_result;
            service_count ++;
            if (service_count > max_service_count) max_service_count = service_count;
          }
        }
        var keys = Object.keys(status);
        var values = keys.map(function (key) {
          return status[key] / (3 * max_service_count);
        });
        var ten_keys = [];
        var ten_values = [];
        for (var i = 1; i <= 10; i++) {
          var idx = Math.ceil(keys.length / 10 * i - 1);
          ten_keys.push(keys[idx]);
          ten_values.push(values[idx]);
        }
        var status_result = {
          "labels": ten_keys,
          "data": ten_values
        };
        console.log(status_result);
        res.send(JSON.stringify(status_result));
        //mongoose.disconnect();
      });
    }
  };

  this.insertCalls = function (service_list, res) {
    console.log("Res is: " + res);
    console.log("State: " + db.readyState);
    if (db.readyState !== 1 && db.readyState !== 3) {
      // console.log('state: not 1 or 3');
      db.on('connected', insert);
    } else if (db.readyState === 1) {
      console.log('state: 1');
      insert();
    }
    function insert() {
      if (service_list.hasOwnProperty('services')) {
        insertCall(service_list.services, service_list.functions, res);
      }
    }
  };

  var insertCall = function (calls, functions, res) {
    console.log("Res is from insert Call: " + res);
    if (calls[0] != null) {
      var call = calls.pop();
      APICall.findOne({name: call.name}, function (err, found_call) {
        if (err) return console.error(err);
        if (found_call == null) {
          var call_obj = new APICall(call);
          call_obj.save(function (err, saved_call) {
            if (err) return console.error(err);
            console.log("Call with id:" + saved_call._id + " has been saved");
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
      console.log("Res is from insertFunction: " + res);
    }
    if (functions[0] != null) {
      var cur_function = functions.pop();
      insertFunctionWithCalls(cur_function, cur_function.services, functions, res);
    }
    else {
      APICall.find(function (err, found_calls) {
        console.log("Res is from outer callback: " + res);
        if (err) return console.error(err);
        var res_obj = {services: found_calls};
        APIFunction.find(function (err, found_functions) {
          console.log("Res is from inner callback: " + res);
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
        console.log("Function with id: " + saved_function._id + " has been saved");
        insertFunctionWithCalls(cur_function, calls, functions, res);
      });
    }
    else {
      var function_calls = found_function.services;
      if (id != null && function_calls.indexOf(id) == -1) {
        function_calls.push(id);
      }
      APIFunction.update({_id: found_function._id}, {$set: {services: function_calls}}, function (err, updated_function) {
        if (err) return console.log(err);
        console.log("Function with id: " + found_function._id + " has been updated");
        insertFunctionWithCalls(cur_function, calls, functions, res);
      })
    }
  }
}

module.exports = new DBManager(config.database);