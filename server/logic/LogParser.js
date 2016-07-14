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
        var promises = [];

        linereader.eachLine(fileUploaded.path, function (line, last) {
            promises.push(parseLine(line, date));

            if (last) {
              console.log("proomises.length: " + promises.length);
              Promise.all(promises).then(function (results) {
                console.log("Hello.....");
                ServiceDbManager.retrieveServicesByDate(date).then(function (services) {
                  //console.log(services);
                  //resolve(JSON.stringify(services));
                  resolve(services);
                  console.log("Done...");
                });
                // ServiceDbManager.retrieveServiceList().then(function (services) {
                //   resolve(JSON.stringify(services));
                // });

              });
            }
        });
      }
    });
  };

  var parseLine = function (line, date) {
    return new Promise(function (resolve) {
      if (line === undefined) resolve();
      var parse_obj = parse(line);
      var raw_url = parse_obj.path;
      if (raw_url === undefined) {
        resolve();
      }
      var url = 'http://pub.lmmp.nasa.gov' + raw_url;
      var base_url = raw_url.split('?')[0];
      var base_url_split = base_url.split('/');
      var function_name = base_url_split[1];
      var service_name = function_name + '_' + base_url_split[base_url_split.length - 1];

      var response_type = null;
      if (parse_obj.path.includes('json')) {
        response_type = 'application/json';
      } else if (parse_obj.path.includes('xml')) {
        response_type = 'text/xml';
      } else if (parse_obj.path.includes('html')) {
        response_type = 'text/html';
      }

      var call_obj = {
        date: date,
        name: service_name,
        raw_url: raw_url,
        base_url: base_url,
        url: url,
        response_type: response_type,
        type: parse_obj.method,
        function_name: function_name
      };

      logParserDb(call_obj).then(function () {
        resolve();
      });
    });
  }
}

var logParser = new LogParser();
module.exports = logParser;