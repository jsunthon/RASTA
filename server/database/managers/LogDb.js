var parse = require('clf-parser');
var linereader = require('line-reader');
var db = require('./dbInit').goose;
var APICall = require('../models/api_call');

module.exports = function (obj) {
  return new Promise(function (resolve) {
    //console.log(log_line);
    var parse_obj = parse(log_line);
    //console.log(parse_obj.path.includes('json'));
    var myString = JSON.stringify(parse_obj.path);
    

    //
    // // Regex to split first part of url path i.e. function name
    // var firstPortion = myString.split(/^(([^:\/?#]+):)?(\/\/([^\/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?/);
    // var functionName = firstPortion[5].split("/")[1];
    // console.log("Function Name: " + functionName);
    //
    //
    // var last = myString.lastIndexOf('/');
    // var serviceName = myString.substr(last).replace("/", "").replace('"',"");
    //
    // if(serviceName.includes('?')){
    //   serviceName = serviceName.split("?",1)[0];
    // }
    // console.log("Service Name: " + serviceName);
    //
    // var jsonServiceName = serviceName + "_" + functionName;
    
    // console.log(parse_obj.path);
    var call_obj = new APICall({
      name: parse_obj.time_local,
      url: 'http://pub.lmmp.nasa.gov' + parse_obj.path,
      response_type: response_type,
      type: parse_obj.method
    });
    // console.log(call_obj);
    // call_obj.save(function (err, saved_obj) {
    //   if (err) return console.error(err);
    //   // console.log('save');
    //   // console.log(saved_obj);
    //   resolve(saved_obj);
    // });
  });
};