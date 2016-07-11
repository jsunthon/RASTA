var parse = require('clf-parser');
var linereader = require('line-reader');
var db = require('./dbInit').goose;

module.exports = function (log_file) {
  linereader.eachLine(log_file, function (line) {
    var parse_obj = parse(line);
    var response_type = null;
    if (parse_obj.path.contains('json')) {
      response_type = 'application/json';
    } else if (parse_obj.path.contains('xml')) {
      response_type = 'text/xml';
    }
    var call_obj = {
      name: parse_obj.time_local,
      url: 'http://pub.lmmp.nasa.gov/' + parse_obj.url,
      response_type: response_type,
      type: 'get'
    };
    call_obj.save();
  })
};