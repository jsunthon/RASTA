var mongoose = require('mongoose');
var APICall = require('./../models/api_call');
var APIFunction = require('./../models/api_function');
var config = require('../../config/constants');
var database = require('./dbInit');

module.exports = function ServiceUpdateDB() {
    this.updateServices = function (service_changes) {
        if (database.goose.readyState !== 1 && database.goose.readyState !== 3) {
            database.goose.once('connected', updateAllServices);
        } else if (database.goose.readyState === 1) {
            var promises = service_changes.map(function (service_change) {
                return updateServiceDB(service_change);
            });
            return Promise.all(promises);
        }
    };

    function updateServiceDB(service_change) {
        if (service_change.delete) {
            return deleteService(service_change._id);
        } else {
            return new Promise(function (resolve) {
                updateServiceFunction(service_change)
                    .then(updateService).then(function() {
                        resolve();
                    });
            });
        }
    }

    function deleteService(service_id) {
        return new Promise(function (resolve) {
            APICall.findOneAndRemove({_id: service_id}, function (err, serviceDeleted) {
                if (!err) {
                    console.log("Service deleted: " + serviceDeleted);
                } else {
                    console.error(err);
                }
                resolve();
            });
        });
    }

    function updateServiceFunction(service_change) {
        return new Promise(function (resolve) {
            APICall.findOne({_id: service_change._id}, function (err, found_service) {
                if (found_service.function_name === service_change.function_name || service_change.function_name === undefined) {
                    resolve({service: service_change, func_id: found_service.function});
                }
                else {
                    APIFunction.findOne({name: service_change.function_name}, function (err, found_function) {
                        if (found_function) {
                            resolve({service: service_change, func_id: found_function._id});
                        }
                        else {
                            var new_function = new APIFunction({
                                name: service_change.function_name,
                                services: [service_change._id]
                            });
                            new_function.save(function (err, save_function) {
                                if (save_function) {
                                    resolve({service: service_change, func_id: save_function._id});
                                }
                            })
                        }
                    });
                }
            });
        });
    }

    var updateService = function (obj) {
        var service_change = obj.service;
        var function_id = obj.func_id;
        return new Promise(function (resolve) {
            var new_name, new_function_name, new_req, new_res;
            APICall.findOne({_id: service_change._id}, function (err, found_service) {
                if (service_change.name) new_name = service_change.name;
                else new_name = found_service.name;

                if (service_change.function_name) new_function_name = service_change.function_name;
                else new_function_name = found_service.function_name;

                if (service_change.response_type) new_res = service_change.response_type;
                else new_res = found_service.response_type;

                if (service_change.type) new_req = service_change.type;
                else new_req = found_service.type;

                APICall.findOneAndUpdate(
                    {_id: service_change._id},
                    {
                        name: new_name,
                        function_name: new_function_name,
                        type: new_req,
                        response_type: new_res,
                        function: function_id
                    },
                    function (err, call) {
                        resolve();
                    }
                );
            });
        });
    }
}