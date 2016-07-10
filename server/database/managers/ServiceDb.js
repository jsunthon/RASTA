var mongoose = require('mongoose');
var APICall = require('./../models/api_call');
var APIFunction = require('./../models/api_function');
var config = require('../../config/constants');

function ServiceDBManager() {
  /**
   * Insert service list json object into the database
   * @param service_list: json service list
   * @returns a promise resolves when insertion completes
   */
  this.insertServiceList = function (service_list) {
    return new Promise(function (resolve, reject) {
      if (db.readyState !== 1 && db.readyState !== 3) {
        db.once('connected', insert);
      } else if (db.readyState === 1) {
        var function_services = service_list.functions
          .map( func => func.services )
          .reduce((pre_val, cur_val) => pre_val.concat(cur_val), []);
        var services = service_list.services.concat(function_services);
        insertCalls(services);
        insertFunctions(service_list.functions)
          .then(resolve());
      }
    });
    
    function insertCalls(calls) {
      calls.map(function(call){
        var call_obj = new APICall(call);
        call_obj.save();
      });
    }

    function insertFunctions(functions) {
      return new Promise(function (resolve, reject) {
        functions.map(function(func) {
          var function_services = map(service => service.name);
          APICall.find({ name: { $in: function_services } }, function (err, found_services) {
            if (err) return console.error(err);
            var service_ids = found_services.map(service => service._id);
            var function_obj = new APIFunction({
              name: func.name,
              critical_level: func.critical_level,
              services: service_ids
            });
            function_obj.save();
            resolve();
          });
        });
      });
    }
  };

  this.retrieveServiceList = function () {
    return new Promise
  }
  
