var superagent = require('superagent');
var parseXML = require('xml2js').parseString;

module.exports = function (app)
{
  app.get('/api', function(req, res)
  {
    superagent
      .get('https://pub.lmmp.nasa.gov/LMMP/rest/dbxml/valsrvc/type/bbox?prjct=IAU2000:30100&type=pixelValue&ulat=-14.765625275432214&ulon=13.078125243954354&llat=-26.859375501024438&llon=25.171875469546578&iPlanetDirectoryPro=AQIC5wM2LY4SfcyaiHL%2Flh97yNQ0oWycMicJM3cFQnSu2E4%3D%40AAJTSQACMDE%3D%23')
      .end(function (err, result) {
        if (err || result.statusCode !== 200) {
          res.send(err);
        }
        else {
          parseXML(result.text, function (err, result) {
            if (err)
            {
              res.send(err);
            }
            else
            {
              res.json(result)
            }
          })
        }
      })
  });

  app.get('/api/:call', function (req, res)
  {
    res.send(req.params.call);
  });
}