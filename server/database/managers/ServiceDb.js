var mongoose = require('mongoose');
var APICall = require('./../models/api_call');
var APIFunction = require('./../models/api_function');
var config = require('../../config/constants');
var database = require('./dbInit');
var AsyncParser = require('../../logic/AsyncParser');
var AsyncCallDb = require('./AsyncCallDb');

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
        if (service_list.functions && service_list.services && service_list.async_services) {
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
            insertAsyncCalls(service_list.async_services).then(function () {
              insertFunctions(service_list.functions).then(function () {
                resolve();
              });
            });
          });
        }

        //process just the functions
        else if (service_list.functions && !service_list.services && !service_list.async_services) {
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
        //process just the services. they may also be synchronous
        else if (!service_list.functions && service_list.services && !service_list.async_services) {
          categorizeServices(service_list.services).then(function (categorizedServices) {
            var syncServices = categorizedServices.sync;
            var asyncServices = categorizedServices.async;

            console.log(JSON.stringify(categorizedServices));

            syncServices = syncServices.map(function (service) {
              return addNecAttr(service, dateIns);
            });

            insertCalls(syncServices)
              .then(insertAsyncCalls(asyncServices))
              .then(function () {
                resolve();
              });
          });
        }
        else if (!service_list.functions && !service_list.services && service_list.async_services) {
          console.log('Async services: ' + JSON.stringify(service_list.async_services));
          insertAsyncCalls(service_list.async_services).then(function () {
            resolve();
          });
        }
      }
    });

    function categorizeServices(services) {
      return new Promise(function (resolve) {
        var asyncParser = new AsyncParser();

        var categorizePromises = services.map(function (service) {
          return asyncParser.isCallAsync(service.url);
        });

        var categorizedServices = {async: [], sync: []};

        Promise.all(categorizePromises).then(function (responses) {
          ///response is an array of true/false values via asyncParser.isCallSync
          responses.forEach(function (isAsync, index) {
            var linkedService = services[index];
            if (isAsync) {
              categorizedServices.async.push(linkedService);
            } else {
              categorizedServices.sync.push(linkedService);
            }
          });

          resolve(categorizedServices);
        });
      });
    }

    function insertAsyncCalls(calls) {
      var asyncCallDbManager = new AsyncCallDb();
      return calls.reduce(function (p, call) {
        return p.then(function () {
          return asyncCallDbManager.parseThenInsert(call.url, dateIns, call.name,
            call.response_type, call.type, call.time_out, call.checker_url);
        });
      }, Promise.resolve());
    }

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
    function getFunctionServiceId(service, funcId, funcName) {
      return new Promise(function (resolve) {
        APICall.findOne({name: service.name}, function (err, apiCall) {
          if (apiCall) {
            console.log('Found api call: ' + JSON.stringify(apiCall));
            APICall.update(
              {name: service.name},
              {$set: {function: funcId, function_name: funcName}},
              function (err, updatedApiCall) {
                if (updatedApiCall) {
                  resolve(apiCall._id);
                }
              });
          } else if (!apiCall) {
            service.function = funcId;
            service.function_name = funcName;
            var callObj = new APICall(service);
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
    function generateServiceIds(function_services, func_id, func_name) {
      return new Promise(function (resolve) {
        var serviceIds = [];
        var promChain = function_services.reduce(function (p, service) {
          return p.then(function (serviceId) {
            if (serviceId) {
              serviceIds.push(serviceId);
            }
            return getFunctionServiceId(service, func_id, func_name);
          })
        }, Promise.resolve());
        promChain.then(function (lastServId) {
          serviceIds.push(lastServId);
          console.log('Got all serv ids.: ' + serviceIds);
          resolve(serviceIds);
        });
      });
    }

    /**
     * Given a list of functions, evaluate them and insert them synchronously
     * @param functions
     * @returns {Promise}
     */
    function insertFunctions(functions) {
      console.log('Func len: ' + functions.length);
      console.log('Functions: ' + JSON.stringify(functions));
      return functions.reduce(function (p, iFunction) {
        return p.then(function () {
          return insertFunction(iFunction);
        });
      }, Promise.resolve());
    }

    /**
     * For a service ID, de-reference it from an existing function
     * @param serviceId
     */
    function cleanFuncServRefs(serviceId, funcId) {
      return new Promise(function (resolve, reject) {
        console.log('cleanFuncServRefs: ' + serviceId + ' ' + funcId);
        APIFunction.findOneAndUpdate(
          {services: serviceId, _id: {$ne: funcId}},
          {$pull: {services: serviceId}},
          {new: true},
          function (err, updatedFunc) {
            if (updatedFunc) {
              console.log('Removed some services ids from old func: ' + JSON.stringify(updatedFunc.name));
              if (updatedFunc.services.length === 0) {
                console.log('removing the function entirely.');
                updatedFunc.remove(function (err, removed) {
                  if (removed) {
                    console.log('Removed func cause of 0 services.');
                  }
                  resolve();
                });
              } else {
                resolve();
              }
            } else {
              resolve();
            }
          });
      });
    }

    /**
     * Insert an individual function
     * @param iFunction
     * @returns {Promise}
     */
    function insertFunction(iFunction) {
      return new Promise(function (resolve, reject) {
        console.log('insertFunction -> Function: ' + JSON.stringify(iFunction)
          + '\n' + 'Services of Func: ' + JSON.stringify(iFunction.services));
        APIFunction.findOne({name: iFunction.name}, function (err, foundFunc) {
          if (foundFunc) {
            console.log('Found a function already.... + ' + JSON.stringify(foundFunc));
            generateServiceIds(iFunction.services, foundFunc._id, foundFunc.name).then(function (serviceIds) {
              //find a function that may possibly references these services; remove them
              var cleanFuncPromises = serviceIds.map(function (serviceId) {
                return cleanFuncServRefs(serviceId, foundFunc._id);
              });

              Promise.all(cleanFuncPromises).then(function () {
                // Regardless, update the function with the correct service id refernences.
                APIFunction.findOneAndUpdate({_id: foundFunc._id},
                  {$addToSet: {services: {$each: serviceIds}}}, {new: true},
                  function (err, updatedFunc) {
                    console.log('Err: ' + err);
                    console.log('Result:  ' + JSON.stringify(updatedFunc));
                    resolve();
                  });
              });
            });
          }
          else if (!foundFunc) {
            console.log('Did not find a function, so let\'s save it.');
            var functionObj = new APIFunction({
              name: iFunction.name
            });

            functionObj.save(function (err, savedFunc) {
              if (savedFunc) {
                console.log('Saved function: ' + JSON.stringify(savedFunc));
                generateServiceIds(iFunction.services, savedFunc._id, savedFunc.name).then(function (serviceIds) {
                  console.log('Service ids: ' + serviceIds);
                  var cleanFuncPromises = serviceIds.map(function (serviceId) {
                    return cleanFuncServRefs(serviceId, savedFunc._id);
                  });
                  Promise.all(cleanFuncPromises).then(function () {
                    APIFunction.findOneAndUpdate({_id: savedFunc._id}, {services: serviceIds}, {new: true}, function (err, updatedFunc) {
                      if (updatedFunc) {
                        console.log('Updated func just created: ' + JSON.stringify(updatedFunc));
                      }
                      resolve();
                    });
                  });
                });
              }
            });
          }
        });
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
