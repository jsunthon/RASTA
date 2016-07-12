var ServiceDbManager = require('../database/managers/ServiceDb.js');
var multer = require('multer');
var upload = multer({ dest: 'uploads/' });
var parse = require('clf-parser');
var fs = require('fs');
var linereader = require('line-reader');
//the string to parse
// var raw_log = '76.228.125.69 - - [16/Oct/2014:19:19:28 -0400] "GET /arcgis/rest/services/CombinedNomenclature/MapServer/find?returnGeometry=true&contains=true&layers=0&searchFields=LABEL&searchText=Ran&f=json HTTP/1.1" 200 9445 "arcgisios" "ArcGISiOS-2.3.2/8.0.2/iPad4,1" 448 9785';

/* This anonymous function that contains all the routes related
 * to uploading config files
 * @param app
 *            app from app = express(); in server.js; provideded upon server start up
 */
module.exports = function (app) {
  var serviceDbInst = ServiceDbManager;

  //former api list
  app.post('/api/post_api_list', function (req, res) {
    console.log(req);
    ServiceDbManager.insertServiceList(service_list).then(function () {
      ServiceDbManager.retrieveServiceList().then(function (services) {
        //console.log(services);
        res.send(JSON.stringify(services));
      })
    });
  });

  app.post('/api/upload', upload.single('file'), function(req, res, next) {
    var fileUploaded = req.file;
    var str = fs.readFileSync(fileUploaded.path, {encoding: 'utf8'});
    linereader.eachLine(fileUploaded.path, function(line) {
      var parsedObj = parse(line);
      console.log(parsedObj);
    });
  });
};