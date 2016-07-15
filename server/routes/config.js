var multer = require('multer');
var upload = multer({ dest: 'uploads/' });
var logParser = require('../logic/LogParser.js');
var updateServiceDB = require('../database/managers/ServiceUpdateDB');

/* This anonymous function that contains all the routes related
 * to uploading config files
 * @param app
 *            app from app = express(); in server.js; provideded upon server start up
 */
module.exports = function (app) {

  app.post('/api/upload', upload.single('file'), function(req, res, next) {
    var fileUploaded = req.file;

    logParser.parseFile(fileUploaded, new Date()).then(function(response) {
      res.send(response);
    });
  });

  app.post('/api/update_service', function(req, res) {
    var service_updater = new updateServiceDB();
    service_updater.updateServices(req.body).then(function () {
      res.send("Hello");
    });
  });
};