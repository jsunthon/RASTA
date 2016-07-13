var multer = require('multer');
var upload = multer({ dest: 'uploads/' });
var logParser = require('../logic/LogParser.js');

/* This anonymous function that contains all the routes related
 * to uploading config files
 * @param app
 *            app from app = express(); in server.js; provideded upon server start up
 */
module.exports = function (app) {

  app.post('/api/upload', upload.single('file'), function(req, res, next) {
    var fileUploaded = req.file;
    var date = new Date();
    logParser.parseFile(fileUploaded, date).then(function(response) {
      res.send(response);
    });
  });
};