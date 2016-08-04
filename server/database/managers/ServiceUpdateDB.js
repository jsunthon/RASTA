var mongoose = require('mongoose');
var APICall = require('./../models/api_call');
var APIFunction = require('./../models/api_function');
var config = require('../../config/constants');
var database = require('./dbInit');
var TestResult = require('./../models/test_result.js');

module.exports = function ServiceUpdateDB() {

  this.updateSingleService = function(service_change) {
    if (database.goose.readyState !== 1 && database.goose.readyState !== 3) {
      var connectPromise = new Promise(function (resolve) {
        database.goose.once('connected', resolve(service_change));
      });
      return connectPromise.then(updateServiceDB);
    } else if (database.goose.readyState === 1) {
      return updateServiceDB(service_change);
    }
  };

  this.updateServices = function (service_changes) {
    if (database.goose.readyState !== 1 && database.goose.readyState !== 3) {
      var connectPromise = new Promise(function (resolve) {
        database.goose.once('connected', resolve(service_changes));
      });
      return connectPromise.then(updateServices);
    } else if (database.goose.readyState === 1) {
      return updateServices(service_changes);
    }
  };

  function updateServices(service_changes) {
    return service_changes.reduce(function (p, service_change) {
      return p.then(function () {
        return updateServiceDB(service_change);
      });
    }, Promise.resolve());
  }

  function updateServiceDB(service_change) {
    if (service_change.delete) {
      return deleteService(service_change._id);
    } else {
      return updateServiceFunction(service_change)
        .then(updateService);
    }
  }

  function deleteService(service_id) {
    return new Promise(function (resolve) {
      APICall.findOneAndRemove({_id: service_id}, function (err, serviceDeleted) {
        if (!err) {
          APIFunction.findOneAndUpdate({services: {$in: [serviceDeleted._id]}},
            {$pullAll: {services: [serviceDeleted._id]}}, {new: true}, function (err, updatedFunc) {
                if (updatedFunc && updatedFunc.services.length === 0) {
                  deleteFunction(updatedFunc._id);
                }
              resolve(serviceDeleted);
            });
        } else {
          console.error(err);
          resolve();
        }
      });
    });
  }

  function deleteFunction(funcId) {
    APIFunction.findOneAndRemove({_id: funcId}, function (err, functionDeleted) {
      if (!err) {
        console.log(functionDeleted + ' removed.');
      }
    });
  }

  function updateServiceFunction(service_change) {
    return new Promise(function (resolve) {
      APICall.findOne({
        _id: service_change._id,
        function_name: service_change.function_name
      }, function (err, found_service) {
        //you have a match
        if (found_service) {
          resolve({service: service_change, func_id: found_service.function});
        }

        //Execute when you change the function name of the service
        else {
          // First, remove the serviceId from any other function that may have already referenced that serviceId,
          // since services can only belong to one function
          APIFunction.findOneAndUpdate({services: service_change._id}, {$pull: {services: service_change._id}}, {new: true}, function (err, response) {
            if (response) {
              if (response.services.length === 0) {
                deleteFunction(response._id);
              }
              //check existence of the function with that name; if so, add the serviceid of the service change obj to the services arr of the function
              APIFunction.findOneAndUpdate({name: service_change.function_name}, {$push: {services: service_change._id}}, {new: true}, function (err, updated_function) {
                if (updated_function) {
                  resolve({service: service_change, func_id: updated_function._id});
                }
                //executes if the function did not yet exist...
                else {
                  var new_function = new APIFunction({
                    name: service_change.function_name,
                    services: [service_change._id]
                  });
                  new_function.save(function (err, save_function) {
                    if (save_function) {
                      console.log(JSON.stringify(save_function));
                      resolve({service: service_change, func_id: save_function._id});
                    } else {
                      console.log("Couldnt save function");
                    }
                  })
                }
              });
            }
            if (err) {
              console.error(err);
            }
          });
        }
      });
    });
  }

  function updateService(obj) {
    var service_change = obj.service;
    var function_id = obj.func_id;

    return new Promise(function (resolve) {
      APICall.findOneAndUpdate(
        {_id: service_change._id},
        {
          name: service_change.name,
          function_name: service_change.function_name,
          type: service_change.type,
          response_type: service_change.response_type,
          time_out: service_change.time_out,
          function: function_id
        },
        {new: true},
        function (err, serviceUpdated) {
          if (serviceUpdated) {
            TestResult.update({service_id: serviceUpdated._id},
              {$set: {service_name: serviceUpdated.name}},
              {multi: true}, function(err, numAffected) {
                resolve(serviceUpdated);
              });
          } else {
            console.log('Couldnt find that service for some reason...');
          }
        }
      );
    });
  }
};