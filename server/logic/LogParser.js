var linereader = require('line-reader');
var fs = require('fs');
var ServiceDbManager = require('../database/managers/ServiceDb.js');
var parse = require('clf-parser');
var logParserDb = require('../database/managers/LogDb');

function LogParser() {
  this.parseFile = function (fileUploaded, date) {
    return new Promise(function (resolve) {
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
          linereader.eachLine(fileUploaded.path, function (line) {
            parseLine(line, date).then(function () {
              resolve();
            });
          });
        });
        promise.then(function () {
          ServiceDbManager.retrieveServicesByDate(date).then(function (services) {
            resolve(JSON.stringify(services));
          });
          // ServiceDbManager.retrieveServiceList().then(function (services) {
          //   resolve(JSON.stringify(services));
          // });
          console.log("Done...");
        });
      }
    });
  };

  var parseLine = function (line, date) {
    var parse_obj = parse(line);
    var myString = JSON.stringify(parse_obj.path);

    try {
      // Regex to split first part of url path i.e. function name
      var firstPortion = myString.split(/^(([^:\/?#]+):)?(\/\/([^\/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?/);
      var functionName = firstPortion[5].split("/")[1];
      console.log("Function Name: " + functionName);


      var last = myString.lastIndexOf('/');
      var serviceName = myString.substr(last).replace("/", "").replace('"', "");

      if (serviceName.includes('?')) {
        serviceName = serviceName.split("?", 1)[0];
      }
      console.log("Service Name: " + serviceName);

      var response_type = null;
      if (parse_obj.path.includes('json')) {
        response_type = 'application/json';
      } else if (parse_obj.path.includes('xml')) {
        response_type = 'text/xml';
      } else if (parse_obj.path.includes('html')) {
        response_type = 'text/html';
      }
      ;

      var jsonServiceName = serviceName + "_" + functionName;

      myString = myString.replace(/['"]+/g, '');
      var obj = {
        dateCreated: date,
        rawUrl: 'http://lmmp.nasa.gov' + myString,
        base_url: 'http://lmmp.nasa.gov' + myString,
        serviceName: jsonServiceName,
        response_type: response_type,
        type: parse_obj.method
      }
      return logParserDb(obj);
    } catch (err) {
      console.log(err);
    }

    return new Promise(function (resolve) {
      resolve();
    });
  }
}

var logParser = new LogParser();
module.exports = logParser;