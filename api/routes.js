var superagent = require('superagent');
var parseXML = require('xml2js').parseString;
var bodyParser = require('body-parser');

module.exports = function (app) {
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
    console.log(req.body);
    res.send(JSON.stringify(req.body));
  });

  app.get('/api/get_function_status', function (req, res) {
    var functions =
    {
      'functions': [
        {
          'name': 'd1',
          'status': {
            "labels": ['2015-08-01', '2015-09-01', '2015-10-01', '2015-11-01', '2015-12-01', '2016-01-01',
                       '2016-02-01', '2016-03-01', '2016-04-01', '2016-06-01', '2016-06-01'],
            'data': [.5, .4, .35, .5, .7, .65, .8, .85, .85, .8, .75]
          }
        },
        {
          'name': 'd2',
          'status': {
            "labels": ['2015-08-01', '2015-09-01', '2015-10-01', '2015-11-01', '2015-12-01', '2016-01-01',
                       '2016-02-01', '2016-03-01', '2016-04-01', '2016-06-01', '2016-06-01'],
            'data': [.5, .4, .35, .5, .7, .65, .8, .85, .85, .8, .75]
          }
        }
      ],
      'more': false
    };
    res.send(JSON.stringify(functions));
  });

  app.get('/api/get_function_status/:keyword', function (req, res) {
    var keyword = req.params.keyword;
    var functions =
    {
      'functions': [
        {
          'name': keyword,
          'status': {
            "labels": ['2015-08-01', '2015-09-01', '2015-10-01', '2015-11-01', '2015-12-01', '2016-01-01',
                       '2016-02-01', '2016-03-01', '2016-04-01', '2016-06-01', '2016-06-01'],
            'data': [.5, .4, .35, .5, .7, .65, .8, .85, .85, .8, .75]
          }
        },
        {
          'name': keyword + '1',
          'status': {
            "labels": ['2015-08-01', '2015-09-01', '2015-10-01', '2015-11-01', '2015-12-01', '2016-01-01',
                       '2016-02-01', '2016-03-01', '2016-04-01', '2016-06-01', '2016-06-01'],
            'data': [.5, .4, .35, .5, .7, .65, .8, .85, .85, .8, .75]
          }
        }
      ],
      'more': false
    };
    res.send(JSON.stringify(functions));
  });

  app.get('/api/get_service_status', function (req, res) {
    var status = {
      "labels": ['2015-08-01', '2015-09-01', '2015-10-01', '2015-11-01', '2015-12-01', '2016-01-01',
                 '2016-02-01', '2016-03-01', '2016-04-01', '2016-06-01', '2016-06-01'],
      'data': [.5, .4, .35, .5, .7, .65, .8, .85, .85, .8, .75]
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
            'data': [.5, .4, .35, .5, .7, .65, .8, .85, .85, .8, .75]
          }
        },
        {
          'name': keyword + '1',
          'status': {
            "labels": ['2015-08-01', '2015-09-01', '2015-10-01', '2015-11-01', '2015-12-01', '2016-01-01',
                       '2016-02-01', '2016-03-01', '2016-04-01', '2016-06-01', '2016-06-01'],
            'data': [.5, .4, .35, .5, .7, .65, .8, .85, .85, .8, .75]
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
            'data': [.5, .4, .35, .5, .7, .65, .8, .85, .85, .8, .75]
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
            'data': [.5, .4, .35, .5, .7, .65, .8, .85, .85, .8, .75]
          }
        },
        {
          'name': keyword + '1',
          'status': {
            "labels": ['2015-08-01', '2015-09-01', '2015-10-01', '2015-11-01', '2015-12-01', '2016-01-01',
              '2016-02-01', '2016-03-01', '2016-04-01', '2016-06-01', '2016-06-01'],
            'data': [.5, .4, .35, .5, .7, .65, .8, .85, .85, .8, .75]
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
}