var mongoose = require('mongoose');
var APICall = require('./../models/api_call');
var APIFunction = require('./../models/api_function');
var config = require('../../config/constants');

function ServiceDBManager() {
  db = mongoose.connection;

  this.insertServiceList = function (service_list, res) {
    if (db.readyState !== 1 && db.readyState !== 3) {
      db.once('connected', insert);
    } else if (db.readyState === 1) {
      insert();
    }
    
    function insertCalls(calls) {
      return new Promise(function (resolve, reject) {
        function insertCallsAux(calls) {
          if (calls[0] !== 0) {
            var call = calls.pop();
            APICall.findOne({ name: call.name }, function (err, found_call) {
              if (err) return console.error(err);
              if (found_call === null) {
                var call_obj = new APICall(call);
                call_obj.save()
              }
            })
          }
        }
      });
    }
    
    function insert() {
      if (service_list.hasOwnProperty('services')) {
        insertCall(service_list.services, service_list.functions, res);
      }
    }
  };

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
}

module.exports = new ServiceDBManager();