var mongoose = require('mongoose');
var APICall = require('./../models/api_call');
var APIFunction = require('./../models/api_function');
var config = require('../../config/constants');
var database = require('./dbInit');

module.exports = function ServiceUpdateDB() {
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
        var promises = service_changes.map(function (service_change) {
            return updateServiceDB(service_change);
        });
        return Promise.all(promises);
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
                    resolve(serviceDeleted);
                } else {
                    console.error(err);
                    resolve();
                }
            });
        });
    }

    function updateServiceFunction(service_change) {
        return new Promise(function (resolve) {
            APICall.findOne({
                _id: service_change._id,
                function_name: service_change.function_name
            }, function (err, found_service) {
                if (found_service) {
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
                    function: function_id
                },
                function (err, serviceUpdated) {
                    resolve(serviceUpdated);
                }
            );
        });
    }
}