var linereader = require('line-reader');
var fs = require('fs');
var ServiceDbManager = require('../database/managers/ServiceDb.js');
var parse = require('clf-parser');
var logParserDb = require('../database/managers/LogDb');

function LogParser() {
  this.parseFile = function(fileUploaded, date) {
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
            parseLine(line, date);
          });
        });
        promise.then(function () {
          ServiceDbManager.retrieveServiceList().then(function (services) {
            resolve(JSON.stringify(services));
          });
        });
      }
    });
  };

  var parseLine = function(line, date) {
    var parse_obj = parse(line);
    //console.log(parse_obj.path.includes('json'));
    var myString = JSON.stringify(parse_obj.path);

    // Regex to split first part of url path i.e. function name
    var firstPortion = myString.split(/^(([^:\/?#]+):)?(\/\/([^\/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?/);
    var functionName = firstPortion[5].split("/")[1];
    console.log("Function Name: " + functionName);


    var last = myString.lastIndexOf('/');
    var serviceName = myString.substr(last).replace("/", "").replace('"',"");

    if(serviceName.includes('?')){
      serviceName = serviceName.split("?",1)[0];
    }
    console.log("Service Name: " + serviceName);

    var response_type = null;
    if (parse_obj.path.includes('json')) {
      response_type = 'application/json';
    } else if (parse_obj.path.includes('xml')) {
      response_type = 'text/xml';
    } else if (parse_obj.path.includes('html')) {
      response_type = 'text/html';
    };

    var jsonServiceName = serviceName + "_" + functionName;
    var obj = {
      dateCreated: date,
      functionName: functionName,
      serviceName: jsonServiceName,
      response_type: response_type,
      type: parse_obj.method
    }
    console.log(JSON.stringify(obj));
    return obj;
  }
}

var logParser = new LogParser();
module.exports = logParser;