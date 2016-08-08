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
  this.insertServiceList = function (service_list, dateIns) {
    console.log('date: ' + dateIns);
    return new Promise(function (resolve, reject) {
      if (database.goose.readyState !== 1 && database.goose.readyState !== 3) {
        database.goose.once('connected', insert);
      } else if (database.goose.readyState === 1) {
        insert();
      }

      function insert() {
        //process both the functions and services
        if (service_list.functions && service_list.services) {
          var function_services = service_list.functions
            .map(func => func.services)
            .reduce((pre_val, cur_val) => pre_val.concat(cur_val), []);
          var services = service_list.services.concat(function_services);

          //add more stuff to services
          var services = services.map(function (service) {
            return addNecAttr(service, dateIns);
          });
          console.log('Services: ' + JSON.stringify(services));
          insertCalls(services).then(function () {
            insertFunctions(service_list.functions).then(function () {
              resolve();
            })
          });
        }

        //process just the functions
        else if (service_list.functions) {
          var functions = service_list.functions;
          functions = functions.map(function (iFunction) {
            iFunction.services = iFunction.services.map(function (service) {
              return addNecAttr(service, dateIns);
            });
            return iFunction;
          });
          insertFunctions(functions).then(function () {
            resolve();
          })
        }
        //process just the services
        else {
          var services = service_list.services.map(function (service) {
            return addNecAttr(service, dateIns);
          });
          insertCalls(services).then(function () {
            resolve();
          });
        }
      }
    });

    function addNecAttr(service, date) {
      var url = service.url;
      var urlWithoutPrefix = stripPrefix(url);
      var baseUrl = '/' + urlWithoutPrefix.split('?')[0];
      service.base_url = baseUrl;
      service.date = date;
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

    function insertCalls(calls) {
      return calls.reduce(function (p, call) {
        return p.then(function () {
          return saveCall(call);
        });
      }, Promise.resolve());
    }

    function saveCall(call) {
      return new Promise(function (resolve) {
        var call_obj = new APICall(call);
        call_obj.save(function (err, call) {
          if (call) {
            console.log('Saved : ' + JSON.stringify(call));
          }
          resolve();
        });
      });
    }

    /**
     * Generate the service id for a service name
     * @param name
     * @returns {Promise}
     */
    function getFunctionServiceId(name) {
      return new Promise(function (resolve) {
        APICall.findOne({name: name}, function (err, apiCall) {
          if (apiCall) {
            console.log('Found api call: ' + JSON.stringify(apiCall));
            resolve(apiCall._id);
          } else if (!apiCall) {
            var callObj = new APICall(function_service);
            console.log('Didnt find api call Will insert..');
            callObj.save(function (err, savedCall) {
              if (err) {
                return console.error(err);
              } else {
                console.log('Saved call: ' + JSON.stringify(savedCall));
                resolve(savedCall._id);
              }
            });
          }
        });
      });
    }

    /**
     * Generate the serviceIds array for function insertion
     * @param function_services
     * @returns {Promise}
     */
    function generateServiceIds(function_services) {
      return new Promise(function (resolve) {
        var serviceIds = [];
        var promChain = function_services.reduce(function (p, name) {
          return p.then(function (serviceId) {
            if (serviceId) {
              serviceIds.push(serviceId);
            }
            return getFunctionServiceId(name);
          })
        }, Promise.resolve());
        promChain.then(function (lastServId) {
          serviceIds.push(lastServId);
          console.log('Got all serv ids.: ' + serviceIds);
          resolve(serviceIds);
        });
      });
    }

    function insertFunctions(functions) {
      var promises = functions.map(function (func) {
        return new Promise(function (resolve, reject) {
          console.log(JSON.stringify(func));
          //if the func already exists, just push the services ids into that func; otherwise, create it.
          var function_services = func.services.map(service => service.name);
          APIFunction.findOne({name: func.name}, function (err, foundFunc) {
            if (foundFunc) {
              console.log('Found a function already.... + ' + JSON.stringify(foundFunc));
              generateServiceIds(function_services).then(function (serviceIds) {
                //update the function once you get the appropriate ids
                APIFunction.update({_id: foundFunc._id},
                  {$pull: {services: {$in: serviceIds}}},
                  {$push: {services: {$each: serviceIds}}}, function (err, updatedFunc) {
                    console.log('Err: ' + err);
                    console.log('Result? ' + JSON.stringify(updatedFunc));
                    resolve();
                  });
              });
            }
            else if (!foundFunc) {
              console.log('Did not find a function');
              generateServiceIds(function_services).then(function(serviceIds) {
                //save the function with those ids
                var functionObj = new APIFunction( {
                  name: func.name,
                  services: serviceIds
                });

                functionObj.save(function(err, savedFunc) {
                  if (savedFunc) {
                    console.log('Saved function: ' + JSON.stringify(savedFunc));
                  }
                  resolve();
                })

              });
            }
          });
        });
      });
      return new Promise(function (resolve, reject) {
        Promise.all(promises).then(function () {
          resolve();
        })
      });
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
      return new Promise(function (resolve, reject) {
        APIFunction.find()
          .populate('services')
          .exec(function (err, found_functions) {
            resolve(found_functions);
          });
      });
    }
  };

  this.retrieveServicesByDate = function (date) {
    return new Promise(function (resolve, reject) {
      APICall.find({date: date}).exec(function (err, services) {
        resolve(services);
      })
    });
  }

  this.getServiceCount = function () {
    return APICall.count().exec();
  }
}

var serviceDB = new ServiceDBManager();
module.exports = serviceDB;
