var mongoose = require('mongoose');
var APICall = require('./../models/api_call');
var APIFunction = require('./../models/api_function');
var config = require('../../config/constants');
var database = require('./dbInit');
var TestResult = require('./../models/test_result.js');

module.exports = function ServiceUpdateDB() {

  var servicesAdded = [];

  this.addServices = function(services) {
    if (database.goose.readyState !== 1 && database.goose.readyState !== 3) {
      var connectPromise = new Promise(function (resolve) {
        database.goose.once('connected', resolve(service_change));
      });
      return connectPromise.then(addServicesDb);
    } else if (database.goose.readyState === 1) {
      return addServicesDb(services);
    }
  }

  function addServicesDb(services) {
    return services.reduce(function(p, serviceToAdd) {
      return p.then(function(savedObj) {
        if (savedObj) {
          servicesAdded.push(savedObj);
        }
        return addServicePromise(serviceToAdd);
      }).catch(function(err) {
        servicesAdded.push(err);
        return addServicePromise(serviceToAdd);
      });
    }, Promise.resolve());
  }

  this.getServicesAdded = function() {
    return servicesAdded;
  }

  function addServicePromise(service) {
    service = addNecAttr(service);
    var callObj = new APICall(service);
    console.log('Attempt to save : ' + JSON.stringify(callObj));
    return new Promise(function(resolve, reject) {
      callObj.save(function(err, savedObj) {
        if (savedObj) {
          console.log('Successfully saved : ' + JSON.stringify(savedObj));
          resolve(savedObj);
        }
        if (err) {
          console.log('Couldn\'t save call');
          reject({});
        }
      });
    });
  }

  function addNecAttr(service) {
    var url = service.url;
    var urlWithoutPrefix = stripPrefix(url);
    var baseUrl = '/' + urlWithoutPrefix.split('?')[0];
    service.base_url = baseUrl;
    return service;
  }

  function stripPrefix(url) {
    var urlWithoutHTTP = url.split('//')[1];
    var urlAuxArr = urlWithoutHTTP.split('/').slice(1, this.length);
    var urlWithoutPrefix = urlAuxArr.reduce(function (prev, curr, currIndex, arr) {
      curr = '/' + curr;
      return prev + curr;
    });
    return urlWithoutPrefix;
  }

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
                      resolve({service: service_change, func_id: save_function._id});
                    } else {
                      console.log("Couldnt save function");
                    }
                  })
                }
              });
            }
            else {
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
          function: function_id,
          reqBody: service_change.reqBody
        },
        {new: true},
        function (err, serviceUpdated) {
          console.log('Service updated: ' + JSON.stringify(serviceUpdated));
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