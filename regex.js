var parse = require('clf-parser');
var fs = require('fs');
var linereader = require('line-reader');
//the string to parse
var raw_log = '76.228.125.69 - - [16/Oct/2014:19:19:28 -0400] "GET /arcgis/rest/services/CombinedNomenclature/MapServer/find?returnGeometry=true&contains=true&layers=0&searchFields=LABEL&searchText=Ran&f=json HTTP/1.1" 200 9445 "arcgisios" "ArcGISiOS-2.3.2/8.0.2/iPad4,1" 448 9785';

//returns an object with key value pairs;
var parsed = parse(raw_log);

//print out the json object
console.log(JSON.stringify(parsed));

var rootPath = './apache-logs';

fs.readdir(rootPath, function(err, fileNameList) {
  fileNameList.forEach(function(fileName) {
    var filePath = rootPath + '/' + fileName;
    linereader.eachLine(filePath, function(line) {
      var parsedObj = parse(line);
      console.log(parsedObj);
    });
  });
});