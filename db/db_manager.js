var mongoose = require('mongoose');
var APICall = require('./models/api_call');
var APIFunction = require('./models/api_function');

function DBManager(connection_string, res) {

  mongoose.connect(connection_string);
  this.db = mongoose.connection;
  this.db.on('error', console.error.bind(console, 'connection error'));

  this.insertCalls = function(service_list) {
    this.db.open('open', function () {
      if (service_list.hasOwnProperty('services')) {
        insertCall(service_list.services, service_list.functions);
      }
    });
  };

  var insertCall = function (calls, functions) {
    if (calls[0] != null) {
      var call = calls.pop();
      APICall.findOne({ name: call.name }, function (err, found_call) {
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
        var res_obj = { services: found_calls }
        APIFunction.find(function (err, found_functions) {
          res_obj.functions = found_functions;
          res.send(JSON.stringify(res_obj));
        })
      })
    }
  };

  var insertFunctionWithCalls = function (cur_function, calls, functions) {
    if (calls[0] != null) {
      var cur_call = calls.pop();
      APIFunction.findOne({ name: cur_function.name }, function (err, found_function) {
        if (err) return console.error(err);
        APICall.findOne({ name: cur_call.name }, function (err, found_call) {
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
  }

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
      APIFunction.update( { _id: found_function._id }, {$set: { services: function_calls }}, function (err, updated_function) {
        if (err) return console.log(err);
        console.log("Function with id: " + found_function._id + " has been updated");
        insertFunctionWithCalls(cur_function, calls, functions);
      })
    }
  }
}
/*function DBManager(connection_string) {

  var insertFunctionWithOneService = function (app_function, service_id) {
    APIFunction.findOne ({ name: app_function.name }, function (err, result_function) {
      if (err) return console.error(err);
      if (result_function == null) {
        var function_obj = APIFunction(
          {
            name: app_function.name,
            critical_level: app_function.critical_level,
            services: [service_id]
          }
        );
        function_obj.save(function (err, saved_function) {
          if (err) return console.error(err);
          console.log("Function with id: " + saved_function._id + " inserted");
        })
      }
      else {
        var call_list = app_function.services;
        call_list.push(service_id);
        APICall.update({ _id: result_function._id }, {$set: { services: call_list }}, function (err, updated_function) {
          if (err) return console.error(err);
          console.log(("Function with id: " + updated_function._id + " updated"))
        });
      }
    })
  };

  var insertFunctionServices = function (app_function, services) {
    services.forEach(function(call) {
      APICall.findOne({ name: call.name }, function (err, one_call) {
        if (err) return console.error(err);
        if (one_call == null) {
          var call_obj = new APICall(call);
          call_obj.save(function (err, result) {
            if (err) return console.error(err);
            console.log("Call with id: " + result._id + " inserted");
            insertFunctionWithOneService(app_function, result.id);
          });
        }
      });
    });
  };

  var insertFunctions = function (functions) {
    functions.forEach(function(app_function) {
      insertFunctionServices(app_function, app_function.services);
    });
  };

  var insertCalls = function (calls) {
    calls.forEach(function (call) {
      APICall.findOne({ name: call.name }, function (err, one_call) {
        if (err) return console.error(err);
        if (one_call == null) {
          var call_obj = new APICall(call);
          call_obj.save(function (err, result) {
            if (err) return console.error(err);
            console.log("Call with id: " + result._id + " inserted");
          });
        }
      });
    });
  };

  this.insertServices = function(service_list) {
    mongoose.connect(connection_string);
    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error'));
    db.open('open', function() {
      if(service_list.hasOwnProperty('services')) {
        insertCalls(service_list.services);
      }
      if (service_list.hasOwnProperty('functions')) {
        insertFunctions(service_list.functions);
      }
    });
  }
}*/

module.exports = DBManager;