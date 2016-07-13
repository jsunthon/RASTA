var parse = require('clf-parser');
var linereader = require('line-reader');
var db = require('./dbInit').goose;
var APICall = require('../models/api_call')

module.exports = function (log_line) {
  return new Promise(function (resolve) {
    //console.log(log_line);
    var parse_obj = parse(log_line);
    //console.log(parse_obj.path.includes('json'));
    var response_type = null;
    if (parse_obj.path.includes('json')) {
      response_type = 'application/json';
    } else if (parse_obj.path.includes('xml')) {
      response_type = 'text/xml';
    } else if (parse_obj.path.includes('html')) {
      response_type = 'text/html';
    };
    // console.log(parse_obj.path);
    var call_obj = new APICall({
      name: parse_obj.time_local,
      url: 'http://pub.lmmp.nasa.gov' + parse_obj.path,
      response_type: response_type,
      type: parse_obj.method
    });
    // console.log(call_obj);
    call_obj.save(function (err, saved_obj) {
      if (err) return console.error(err);
      // console.log('save');
      // console.log(saved_obj);
      resolve(saved_obj);
    });
  });
};