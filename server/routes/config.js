var multer = require('multer');
var upload = multer({dest: 'uploads/'});
var logParser = require('../logic/LogParser.js');
var updateServiceDB = require('../database/managers/ServiceUpdateDB');
var TestDbManager = require('../database/managers/TestDb.js');
var prefixManager = require('../database/managers/UrlPrefixDB');

/* This anonymous function that contains all the routes related
 * to uploading config files
 * @param app
 *            app from app = express(); in server.js; provideded upon server start up
 */
module.exports = function (app) {

  app.post('/api/upload', upload.single('file'), function (req, res, next) {
    var fileUploaded = req.file;
    var fileExt = req.body.ext;
    var prefix = req.body.prefix;
    logParser.parseFile(fileUploaded, new Date()).then(function (response) {
      res.send(response);
    });
  });

  app.post('/api/update_service', function (req, res) {
    var service_updater = new updateServiceDB();
    service_updater.updateServices(req.body)
      .then(TestDbManager.retrieveServiceListIPromise)
      .then(function (response) {
        res.json(response);
      });
  });


  app.post('/api/prefix/insert/:prefix', function (req, res) {
    prefixManager.insertPrefix(req.params.prefix).then(function (res_code) {
      res.sendStatus(res_code);
    });
  });

  app.get('/api/prefix/retrieve', function (req, res) {
    prefixManager.retrievePrefix().then(function (results) {
      if (results === 500) res.sendStatus(500);
      else res.status(200).send(results);
    });
  });

  app.post('/api/prefix/delete/:prefix', function (req, res) {
    prefixManager.deletePrefix(req.params.prefix).then(function (res_code) {
      res.sendStatus(res_code);
    });
  });
};