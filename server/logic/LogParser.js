var parse = require('clf-parser');
var linereader = require('line-reader');

module.exports = function (log_file) {
  linereader.eachLine(log_file, function (line) {
    var parse_obj = parse(line);
    
  })
};