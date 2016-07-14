var parse = require('clf-parser');
var linereader = require('line-reader');
var db = require('./dbInit').goose;
var APICall = require('../models/api_call');

module.exports = function (obj) {
  //var arr = obj.serviceName.split('_');
  //var serviceName = arr[0];
  // console.log("Service name: " + serviceName);
  //var functionName = arr[1];
  // console.log("Function name: " + functionName);
  // console.log(obj);
  return new Promise(function (resolve) {
    var call_obj = new APICall({
      date: obj.date,
      name: obj.name,
      raw_url: obj.raw_url,
      base_url: obj.base_url,
      response_type: obj.response_type,
      type: obj.type,
      function_name: obj.function_name
    });
    call_obj.save(function (err, saved_obj) {
      if (err) return console.error(err);
      // console.log(saved_obj);
      resolve();
    });
  });
};