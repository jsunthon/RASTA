var db = require('./dbInit').goose;
var URLPrefix = require('./../models/url_prefix');

function UrlPrefixDbManager() {
  this.insertPrefix = function (prefix) {
    return new Promise(function (resolve) {
      if (db.readyState !== 1 && db.readyState !== 3) {
        db.once('connected', insertPrefixAux);
      }
      else insertPrefixAux();

      function insertPrefixAux() {
        var prefix_obj = new URLPrefix({ prefix: prefix });
        prefix.save(function (err, save_prefix) {
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
        URLPrefix.findOneAndRemove({ prefix: prefix }, function (err, removed_prefix) {
          if (err || !removed_prefix) resolve(500);
          else resolve(200);
        });
      }
    });
  };
}

var prefixManager = new UrlPrefixDbManager();
module.exports = prefixManager;