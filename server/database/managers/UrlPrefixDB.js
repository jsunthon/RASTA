var db = require('./dbInit').goose;
var URLPrefix = require('./../models/url_prefix');
var ApiCall = require('./../models/api_call');
var APIFunction = require('../models/api_function');

function UrlPrefixDbManager() {
  this.insertPrefix = function (prefix) {
    return new Promise(function (resolve) {
      console.log("insert prefix executing.");
      if (db.readyState !== 1 && db.readyState !== 3) {
        db.once('connected', insertPrefixAux);
      }
      else insertPrefixAux();

      function insertPrefixAux() {
        var prefix_obj = new URLPrefix({prefix: prefix});
        prefix_obj.save(function (err, save_prefix) {
          console.log(save_prefix);
          if (err || !save_prefix) resolve(500);
          else resolve(200);
        });
      }
    });
  };

  this.retrievePrefix = function () {
    return new Promise(function (resolve) {
      if (db.readyState !== 1 && db.readyState !== 3) {
        db.once('connected', retrievePrefixAux);
      }
      else retrievePrefixAux();

      function retrievePrefixAux() {
        URLPrefix.find(function (err, found_prefixes) {
          if (err) resolve(500);
          else resolve(found_prefixes);
        });
      }
    });
  };

  this.deletePrefix = function (prefix) {
    return new Promise(function (resolve) {
      if (db.readyState !== 1 && db.readyState !== 3) {
        db.once('connected', deletePrefixAux);
      }
      else deletePrefixAux();

      function deletePrefixAux() {
        URLPrefix.findOneAndRemove({prefix: prefix}, function (err, removed_prefix) {
          if (err || !removed_prefix) resolve({statusCode: 500});
          else {
            ApiCall.remove({url: {$regex: "^" + prefix}}, function (err, removedService) {
              if (!err) {
                console.log("Successfully removed service w/ prefix: " + prefix + ".");
                updateFunctionsAfterPrefixRemoval();
                resolve({statusCode: 200, numRemoved: removedService.result.n, prefixRemoved: removed_prefix});
              }
            });
          }
        });
      }
    });
  };

  function updateFunctionsAfterPrefixRemoval() {
    APIFunction.find().exec(function(err, funcs) {
      funcs.forEach(function(func) {
        var apiCallIds = func.services;
        apiCallIds.forEach(function(apiCallId) {
          ApiCall.findOne({_id: apiCallId}).exec(function(err, apiCall) {
            if (apiCall === null) {
              APIFunction.findOneAndUpdate({services: apiCallId}, {$pull: {services: apiCallId}}, {new: true}, function (err, updatedFunc) {
                if (updatedFunc.services.length === 0) {
                  updatedFunc.remove();
                }
              });
            }
          });
        });
      });
    });
  }
}

var prefixManager = new UrlPrefixDbManager();
module.exports = prefixManager;