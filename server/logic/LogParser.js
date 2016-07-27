var linereader = require('line-reader');
var fs = require('fs');
var ServiceDbManager = require('../database/managers/ServiceDb.js');
var parse = require('clf-parser');
var logParserDb = require('../database/managers/LogDb');
var Tester = require('../logic/Tester');
var prefixManager = require('../database/managers/UrlPrefixDB')

function LogParser() {
  var tester = new Tester();

  this.parseFile = function (fileUploaded, date, prefix) {
    return new Promise(function (resolve) {
      if (!prefix.toLowerCase().startsWith('http://')) prefix = 'http://' + prefix;
      prefixManager.insertPrefix(prefix).then();
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
        var parsedLineObjs = [];
        var base_urls = [];
        linereader.eachLine(fileUploaded.path, function (line, last) {
          if (line !== undefined) {
            var parsedObj = parse(line);
            var raw_url = parsedObj.path;
            if (raw_url) {
              var base_url = raw_url.split('?')[0];
              var base_url_split = base_url.split('/');
              var function_name = base_url_split[1];
              var service_name = function_name + '_' + base_url_split[base_url_split.length - 1];
              if (base_urls.indexOf(base_url) === -1 && service_name != '_' && function_name) {
                base_urls.push(base_url);
                parsedLineObjs.push(parsedObj);
              }
            }
            if (last) {
              console.log('last line reached.');
              //at this pt, we should have all the things.
              var parsePromises = parsedLineObjs.map(function (parsedObj) {
                return parseLine(parsedObj, date, prefix);
              });

              Promise.all(parsePromises).then(function (objs) {
                var savePromises = objs.map(function (obj) {
                  return logParserDb(obj);
                });

                Promise.all(savePromises).then(function () {
                  ServiceDbManager.retrieveServicesByDate(date).then(function (services) {
                    resolve(services);
                  });
                });
              });
            }
          }
        });
      }
    });
  };


  var parseLine = function (parse_obj, date, prefix) {
    return new Promise(function (resolve) {
      var raw_url = parse_obj.path;
      var url = prefix + raw_url;
      var base_url = raw_url.split('?')[0];
      var base_url_split = base_url.split('/');
      var function_name = base_url_split[1];
      var service_name = function_name + '_' + base_url_split[base_url_split.length - 1];
      var call_method = parse_obj.method;

      //var tester = new Tester();
      tester.testForResType(call_method, url).then(function (content_type) {
        var response_type = content_type;
        console.log('Responsr type for ' + url + ' : ' + content_type);
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
        resolve(call_obj);
      });
    });
  };
}

var logParser = new LogParser();
module.exports = logParser;