var mongoose = require('mongoose');
var APICall = require('./../models/api_call');
var APIFunction = require('./../models/api_function');
var config = require('../../config/constants');
var database = require('./dbInit');

function ServiceDBManager() {

  /**
   * Insert service list json object into the database
   * @param service_list: json service list
   * @returns a promise resolves when insertion completes
   */
  this.insertServiceList = function (service_list) {
    console.log(service_list.constructor);
    return new Promise(function (resolve, reject) {
      if (database.goose.readyState !== 1 && database.goose.readyState !== 3) {
        database.goose.once('connected', insert);
      } else if (database.goose.readyState === 1) {
        insert();
      }

      function insert() {
        var function_services = service_list.functions
          .map(func => func.services)
          .reduce((pre_val, cur_val) => pre_val.concat(cur_val), []);
        var services = service_list.services.concat(function_services);
        insertCalls(services).then(function () {
          insertFunctions(service_list.functions).then(function () {
            resolve();
          })
        });
      }
    });

    function insertCalls(calls) {
      var promises = calls.map(function (call) {
        return new Promise(function (resolve, reject) {
          var call_obj = new APICall(call);
          call_obj.save(function (err) {
            //if (err) console.error(err);
            resolve();
          });
        });
      });
      return Promise.all(promises);
    }

    function insertFunctions(functions) {
      var promises = functions.map(function (func) {
        return new Promise(function (resolve, reject) {
          var function_services = func.services.map(service => service.name);
          APICall.find({ name: {$in: function_services } }, function (err, found_services) {
            if (err) return console.error(err);
            var service_ids = found_services.map(service => service._id);
            var function_obj = new APIFunction({
              name: func.name,
              critical_level: func.critical_level,
              services: service_ids
            });
            function_obj.save(function (err) {
              if (err) return console.error(err);
              resolve()
            })
          })
        });
      });
      return new Promise(function (resolve, reject) {
        Promise.all(promises).then(function () {
          resolve();
        })
      })
    }
  };

  this.retrieveServiceList = function () {
    return new Promise(function (resolve, reject) {
      var service_list = {};
      retrieveServices().then(function (services) {
        service_list.services = services;
        retrieveFunctions().then(function (funcs) {
          service_list.functions = funcs;
          resolve(service_list);
        })
      })
    });

    function retrieveServices() {
      return new Promise(function (resolve, reject) {
        APICall.find(function (err, found_results) {
          if (err) return console.error(err);
          resolve(found_results);
        });
      });
    }

    function retrieveFunctions() {
      return new Promise (function (resolve, reject) {
        APIFunction.find()
          .populate('services')
          .exec(function (err, found_functions) {
            resolve(found_functions);
          });
      });
    }
  };
}
  
var serviceDB = new ServiceDBManager();
module.exports = serviceDB;
