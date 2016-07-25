var db = require('./dbInit').goose;
var URLPrefix = require('./../models/url_prefix');
var ApiCall = require('./../models/api_call');
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
                resolve({statusCode: 200, numRemoved: removedService.result.n, prefixRemoved: removed_prefix});
              }
            });
          }
        });
      }
    });
  };
}

var prefixManager = new UrlPrefixDbManager();
module.exports = prefixManager;