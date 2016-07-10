var ServiceDbManager = require('../database/managers/ServiceDb.js');

/* This anonymous function that contains all the routes related
* to uploading config files
* @param app
*            app from app = express(); in server.js; provideded upon server start up
*/
module.exports = function(app) {
    var serviceDbInst = ServiceDbManager;
    app.post('/api/post_api_list', function (req, res) {
        var service_list = req.body;
        serviceDbInst.insertServiceList(service_list, res);
    });
}