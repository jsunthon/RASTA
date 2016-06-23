var mongoose = require('mongoose');
var APICall = require('./models/api_call');
var APIFunction = require('./models/api_function');
var TestResult = require('./models/test_result');

function DBManager(connection_string, res) {

  mongoose.connect(connection_string);
  this.db = mongoose.connection;
  this.db.on('error', console.error.bind(console, 'connection error'));

  this.insertCalls = function (service_list) {
    this.db.open('open', function () {
      if (service_list.hasOwnProperty('services')) {
        insertCall(service_list.services, service_list.functions);
      }
    });
  };

  this.testFunction = function (function_name, testCallback) {
    this.db.open('open', function () {
      APIFunction.findOne({name: function_name}, function (err, found_function) {
        if (err) return console.error(err);
        if (found_function == null) return console.error('function not found');
        else {
          testService(found_function.services, testCallback);
        }
      })
    })
  };

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
    else {
      mongoose.disconnect();
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

  this.insertTestResult = function (call_url, call_result, epoch_seconds) {
    this.db.open('open', function () {
      APICall.findOne({ url: call_url }, function (err, found_call) {
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
    })
  };

  this.retrieveCallResults = function (call_name, res) {
    this.db.open('open', function () {
      TestResult.find({ name: call_name }, function (err, found_results) {
        
      })
    })
  };

  this.retrieveFunctionResults = function (res) {

  };

  this.retrieveOverallResults = function (res) {

  };

  var insertCall = function (calls, functions) {
    if (calls[0] != null) {
      var call = calls.pop();
      APICall.findOne({name: call.name}, function (err, found_call) {
        if (err) return console.error(err);
        if (found_call == null) {
          var call_obj = new APICall(call);
          call_obj.save(function (err, saved_call) {
            if (err) return console.error(err);
            console.log("Call with id:" + saved_call._id + " has been saved");
            insertCall(calls, functions);
          });
        }
        else {
          insertCall(calls, functions);
        }
      });
    }
    else {
      insertFunction(functions);
    }
  };

  var insertFunction = function (functions) {
    if (functions[0] != null) {
      var cur_function = functions.pop();
      insertFunctionWithCalls(cur_function, cur_function.services, functions);
    }
    else {
      APICall.find(function (err, found_calls) {
        if (err) return console.error(err);
        var res_obj = {services: found_calls}
        APIFunction.find(function (err, found_functions) {
          res_obj.functions = found_functions;
          res.send(JSON.stringify(res_obj));
          mongoose.disconnect();
        })
      })
    }
  };

  var insertFunctionWithCalls = function (cur_function, calls, functions) {
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
              insertFunctionWithOneCall(cur_function, calls, functions, saved_call._id, found_function);
            });
          }
          else {
            insertFunctionWithOneCall(cur_function, calls, functions, found_call._id, found_function);
          }
        });
      })
    }
    else {
      insertFunction(functions);
    }
  };

  var insertFunctionWithOneCall = function (cur_function, calls, functions, id, found_function) {
    if (found_function == null) {
      var function_obj = new APIFunction({
        name: cur_function.name,
        critical_level: cur_function.critical_level,
        services: [id]
      });
      function_obj.save(function (err, saved_function) {
        if (err) return console.error(err);
        console.log("Function with id: " + saved_function._id + " has been saved");
        insertFunctionWithCalls(cur_function, calls, functions);
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
        insertFunctionWithCalls(cur_function, calls, functions);
      })
    }
  }
}

module.exports = DBManager;