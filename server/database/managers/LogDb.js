var parse = require('clf-parser');
var linereader = require('line-reader');
var db = require('./dbInit').goose;
var APICall = require('../models/api_call');

module.exports = function (obj) {
  var arr = obj.serviceName.split('_');
  var serviceName = arr[0];
  // console.log("Service name: " + serviceName);
  var functionName = arr[1];
  // console.log("Function name: " + functionName);
  // console.log(obj);
  return new Promise(function (resolve) {
    var call_obj = new APICall({
      date: obj.dateCreated,
      name: obj.serviceName,
      raw_url: obj.rawUrl,
      base_url: obj.baseUrl,
      response_type: obj.response_type,
      type: obj.type
      // functions: functionName
    });
    call_obj.save(function (err, saved_obj) {
      if (err) return console.error(err);
      // console.log(saved_obj);
      resolve(saved_obj);
    });
  });
};