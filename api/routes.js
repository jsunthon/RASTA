var superagent = require('superagent');
var parseXML = require('xml2js').parseString;
var bodyParser = require('body-parser');
var Tester = require('../test/tester');
var mongoose = require('mongoose');
var DB_manager = require('../db/db_manager');
var config = require('../config/database');

module.exports = function (app) {
  // var dbManager = new DB_manager()
  var test = new Tester();

  app.use(bodyParser.json());

  app.get('/api', function (req, res) {
    superagent
      .get('https://pub.lmmp.nasa.gov/LMMP/rest/dbxml/valsrvc/type/bbox?prjct=IAU2000:30100&type=pixelValue&ulat=-14.765625275432214&ulon=13.078125243954354&llat=-26.859375501024438&llon=25.171875469546578&iPlanetDirectoryPro=AQIC5wM2LY4SfcyaiHL%2Flh97yNQ0oWycMicJM3cFQnSu2E4%3D%40AAJTSQACMDE%3D%23')
      .end(function (err, result) {
        if (err || result.statusCode !== 200) {
          res.send(err);
        }
        else {
          parseXML(result.text, function (err, result) {
            if (err) {
              res.send(err);
            }
            else {
              res.json(result)
            }
          })
        }
      })
  });

  app.post('/api/post_api_list', function (req, res) {
    var service_list = req.body;
    var db_manager = new DB_manager(config.database, res);
    db_manager.insertCalls(service_list);
  });

  app.get('/api/get_function_status', function (req, res) {
/*    var funcs = [];
    for (var i = 0; i < 10000; i++) {
      funcs.push({
        'name': 'd' + i,
        'status': {
          "labels": ['2015-08-01', '2015-09-01', '2015-10-01', '2015-11-01', '2015-12-01', '2016-01-01',
            '2016-02-01', '2016-03-01', '2016-04-01', '2016-06-01', '2016-06-01'],
          'data': [.5, .4, .35, .5, .7, .65, .8, .85, .85, .8, .75]
        }
      })
    }
    var functions =
    {
      'functions': funcs,
      'more': false
    };
    res.send(JSON.stringify(functions));*/
  });

  app.get('/api/get_function_status/:keyword', function (req, res) {
    /*var keyword = req.params.keyword;
    var functions =
    {
      'functions': [
        {
          'name': keyword,
          'status': {
            "labels": ['2015-08-01', '2015-09-01', '2015-10-01', '2015-11-01', '2015-12-01', '2016-01-01',
                       '2016-02-01', '2016-03-01', '2016-04-01', '2016-06-01', '2016-06-01'],
            'data': [.4, .5, .45, .6, .7, .8, .75, .85, .75, .8, .6]
          }
        },
        {
          'name': keyword + '1',
          'status': {
            "labels": ['2015-08-01', '2015-09-01', '2015-10-01', '2015-11-01', '2015-12-01', '2016-01-01',
                       '2016-02-01', '2016-03-01', '2016-04-01', '2016-06-01', '2016-06-01'],
            'data': [.1, .2, .35, .4, .6, .7, .8, .85, .9, .8, .75]
          }
        }
      ],
      'more': false
    };
    res.send(JSON.stringify(functions));*/
    var db_manager = new DB_manager(config.database, res);
    db_manager.retrieveFunctionResults(req.params.keyword, res);
  });

  app.get('/api/get_service_status', function (req, res) {
    var status = {
      "labels": ['2015-08-01', '2015-09-01', '2015-10-01', '2015-11-01', '2015-12-01', '2016-01-01',
                 '2016-02-01', '2016-03-01', '2016-04-01', '2016-06-01', '2016-06-01'],
      'data': [.2, .9, .35, .4, .65, .45, .8, .9, .85, .7, .75]
    };
    res.send(JSON.stringify(status));
  });

  app.get('/api/get_service_status/:keyword', function (req, res) {
    var keyword = req.params.keyword;
    var services =
    {
      'services': [
        {
          'name': keyword,
          'status': {
            "labels": ['2015-08-01', '2015-09-01', '2015-10-01', '2015-11-01', '2015-12-01', '2016-01-01',
                       '2016-02-01', '2016-03-01', '2016-04-01', '2016-06-01', '2016-06-01'],
            'data': [.3, .2, .35, .45, .75, .35, .65, .75, .5, .85, .6]
          }
        },
        {
          'name': keyword + '1',
          'status': {
            "labels": ['2015-08-01', '2015-09-01', '2015-10-01', '2015-11-01', '2015-12-01', '2016-01-01',
                       '2016-02-01', '2016-03-01', '2016-04-01', '2016-06-01', '2016-06-01'],
            'data': [.4, .6, .35, .45, .75, .5, .85, .7, .6, .5, .45]
          }
        }
      ],
      'more': false
    };
    res.send(JSON.stringify(services));
  });

  app.get('/api/get_service_status_by_function/:function_name', function (req, res) {
    var function_name = req.params.function_name;
    var services =
    {
      'services': [
        {
          'name': 's1',
          'status': {
            "labels": ['2015-08-01', '2015-09-01', '2015-10-01', '2015-11-01', '2015-12-01', '2016-01-01',
              '2016-02-01', '2016-03-01', '2016-04-01', '2016-06-01', '2016-06-01'],
            'data': [.5, .4, .35, .5, .7, .65, .8, .85, .85, .8, .75]
          }
        },
        {
          'name': 's2',
          'status': {
            "labels": ['2015-08-01', '2015-09-01', '2015-10-01', '2015-11-01', '2015-12-01', '2016-01-01',
              '2016-02-01', '2016-03-01', '2016-04-01', '2016-06-01', '2016-06-01'],
            'data': [.7, .4, .35, .65, .75, .5, .55, .65, .75, .8, .9]
          }
        }
      ],
      'more': false
    };
    res.send(JSON.stringify(services));
  });

  app.get('/api/get_service_status_by_function/:function_name/:keyword', function (req, res) {
    var function_name = req.params.function_name;
    var keyword = req.params.keyword;
    var services =
    {
      'services': [
        {
          'name': keyword,
          'status': {
            "labels": ['2015-08-01', '2015-09-01', '2015-10-01', '2015-11-01', '2015-12-01', '2016-01-01',
              '2016-02-01', '2016-03-01', '2016-04-01', '2016-06-01', '2016-06-01'],
            'data': [.3, .4, .6, .75, .7, .55, .8, .95, .85, .9, .5]
          }
        },
        {
          'name': keyword + '1',
          'status': {
            "labels": ['2015-08-01', '2015-09-01', '2015-10-01', '2015-11-01', '2015-12-01', '2016-01-01',
              '2016-02-01', '2016-03-01', '2016-04-01', '2016-06-01', '2016-06-01'],
            'data': [.5, .45, .65, .45, .75, .5, .85, .9, .6, .8, .35]
          }
        }
      ],
      'more': false
    };
    res.send(JSON.stringify(services));
  });

  app.get('/api/:call', function (req, res) {
    res.send(req.params.call);
  });

  //end-point for testing a function
  app.get('/api/testFunction/:function', function(req, res) {
    test.testFunction(req.params.function, res);
    //dbManager code here
  });

  //end-point for testing a service
  app.get('/api/testApiService/:service', function(req, res) {
    test.testService(req.params.service, res);
    //dbManager code here
  });
}