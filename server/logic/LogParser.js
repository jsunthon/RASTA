var linereader = require('line-reader');
var fs = require('fs');
var ServiceDbManager = require('../database/managers/ServiceDb.js');
var logParserDb = require('../database/managers/LogDb');

function LogParser() {
  this.parseFile = function(fileUploaded) {
    return new Promise(function(resolve) {
      var file_ext = fileUploaded.originalname.split('.').pop();
      var str = fs.readFileSync(fileUploaded.path, {encoding: 'utf8'});

      console.log(file_ext);
      if (file_ext == "json") {
        ServiceDbManager.insertServiceList(JSON.parse(str)).then(function () {
          ServiceDbManager.retrieveServiceList().then(function (services) {
            resolve(JSON.stringify(services));
          });
        });
      } else {
        var promise = new Promise(function (resolve) {
          linereader.eachLine(fileUploaded.path, function(line) {
            logParserDb(line).then(function () {
              resolve();
            });
          });
        });
        promise.then(function () {
          ServiceDbManager.retrieveServiceList().then(function (services) {
            resolve(JSON.stringify(services));
          });
        });
      }
    });
  }
}

var logParser = new LogParser();
module.exports = logParser;