var xml2json = require('xml2js').parseString;
request = require('request').defaults({jar: true});

function AsyncParser() {
  var self = this;

  this.authorize = function () {
    var login_url = 'https://ops.lmmp.nasa.gov/opensso/UI/Login';
    var credential_form = {form: {IDToken1: 'lmmpdev', IDToken2: 'devlmmp'}};
    return new Promise(function (resolve, reject) {
      request.post(login_url, credential_form, function (err) {
        if (err) {
          console.error(err);
          reject();
        }
        resolve();
      })
    });
  };

  this.makeRequest = function (url) {
    return new Promise(function (resolve, reject) {
      request.get(url, function (err, res, body) {
        if (err) {
          console.error(err);
          reject();
        }
        resolve({ res: res, body: body });
      })
    })
  };
  
  this.isLoginRequired = function (url) {
    return new Promise(function (resolve, reject) {
      request.get(url, function (err, res) {
        var key_string = '/opensso/UI/Login';
        resolve(JSON.stringify(res).includes(key_string));
      })
    })
  };

  this.isCallAsync = function (url) {
    this.isLoginRequired(url).then(function (resolve) {
      console.log(resolve);
      if (resolve) {
        this.authorize().then(function () {
          this.makeRequest(url).then(function (resolve) {
            console.log(resolve);
            if(resolve.res.headers['content-type'] === 'application/xml') {
              console.log(body);
            }
          });
        });
      }
    });
  };

}

var string = '<Result> <Hazard> <WorkOrderID>0fcbf516-bf38-43eb-91dd-953135ce5382</WorkOrderID> <SubmitterID>rhan</SubmitterID> <Status> <Enqueued>2016-07-18T21:01:13Z</Enqueued> </Status> <InputParams> <Parameter name="Hazard Type">rock</Parameter> <Parameter name="Plot Type">cfasfd</Parameter> <Parameter name="Upper Lat">-8.6931</Parameter> <Parameter name="Upper Lon">15.6373</Parameter> <Parameter name="Lower Lat">-9.6299</Parameter> <Parameter name="Lower Lon">15.7361</Parameter> <Parameter name="Mode">async</Parameter> </InputParams> </Hazard> <Hazard> <WorkOrderID>6ab2a0d0-7ab7-4537-ae39-3ae98a4420ae</WorkOrderID> <SubmitterID>rhan</SubmitterID> <Status> <Enqueued>2016-07-18T21:04:50Z</Enqueued> </Status> <InputParams> <Parameter name="Hazard Type">crater</Parameter> <Parameter name="Plot Type">cfasfd</Parameter> <Parameter name="Upper Lat">-8.6931</Parameter> <Parameter name="Upper Lon">15.6373</Parameter> <Parameter name="Lower Lat">-9.6299</Parameter> <Parameter name="Lower Lon">15.7361</Parameter> <Parameter name="Mode">async</Parameter> </InputParams> </Hazard> <Hazard> <WorkOrderID>8f2e3db8-ba2e-4326-b18c-6b08d88dd926</WorkOrderID> <SubmitterID>rhan</SubmitterID> <Status> <Enqueued>2016-07-18T21:34:11Z</Enqueued> </Status> <InputParams> <Parameter name="Hazard Type">rock</Parameter> <Parameter name="Plot Type">cfasfd</Parameter> <Parameter name="Upper Lat">-8.6931</Parameter> <Parameter name="Upper Lon">15.6373</Parameter> <Parameter name="Lower Lat">-9.6299</Parameter> <Parameter name="Lower Lon">15.7361</Parameter> <Parameter name="Mode">async</Parameter> </InputParams> </Hazard> <Hazard> <WorkOrderID>b6237da8-13e0-4b46-a755-4085b6400695</WorkOrderID> <SubmitterID>rhan</SubmitterID> <Status> <Enqueued>2016-07-18T21:34:54Z</Enqueued> </Status> <InputParams> <Parameter name="Hazard Type">rock</Parameter> <Parameter name="Plot Type">cfasfd</Parameter> <Parameter name="Upper Lat">-9.171388</Parameter> <Parameter name="Upper Lon">15.66253</Parameter> <Parameter name="Lower Lat">-9.213136</Parameter> <Parameter name="Lower Lon">15.695489</Parameter> <Parameter name="Mode">async</Parameter> </InputParams> </Hazard> <Hazard> <WorkOrderID>36b80090-cbb0-417b-8001-d6bfd85cade1</WorkOrderID> <SubmitterID>rhan</SubmitterID> <Status> <Enqueued>2016-07-18T21:36:46Z</Enqueued> </Status> <InputParams> <Parameter name="Hazard Type">rock</Parameter> <Parameter name="Plot Type">cfasfd</Parameter> <Parameter name="Upper Lat">-9.171388</Parameter> <Parameter name="Upper Lon">15.66253</Parameter> <Parameter name="Lower Lat">-9.213136</Parameter> <Parameter name="Lower Lon">15.695489</Parameter> <Parameter name="Mode">async</Parameter> </InputParams> </Hazard> <Hazard> <WorkOrderID>bb211c48-3254-4d80-9d79-ae1871382359</WorkOrderID> <SubmitterID>rhan</SubmitterID> <Status> <Enqueued>2016-07-18T21:36:47Z</Enqueued> </Status> <InputParams> <Parameter name="Hazard Type">rock</Parameter> <Parameter name="Plot Type">cfasfd</Parameter> <Parameter name="Upper Lat">-9.171388</Parameter> <Parameter name="Upper Lon">15.66253</Parameter> <Parameter name="Lower Lat">-9.213136</Parameter> <Parameter name="Lower Lon">15.695489</Parameter> <Parameter name="Mode">async</Parameter> </InputParams> </Hazard> </Result>';
var url = 'https://ops.lmmp.nasa.gov/LMMP/rest/hazard/result';
var parser = new AsyncParser();
parser.isCallAsync(url);

//xml2json(string, function (err, json) {
//  if (err) return console.error(err);
//  console.log(JSON.stringify(json));
//});