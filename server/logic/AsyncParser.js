var xml2json = require('xml2js').parseString;
request = require('request').defaults({jar: true});

function AsyncParser() {
  var self = this;

  this.authorize = function () {
    var login_url = 'https://ops.lmmp.nasa.gov/opensso/UI/Login';
    var credential_form = {form: {IDToken1: 'lmmpdev', IDToken2: 'devlmmp'}};
    console.log('Attempt to authorize...');
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
    console.log('make req for :' + url);
    return new Promise(function (resolve, reject) {
      request.get(url, function (err, res, body) {
        if (err) {
          console.error(err);
          reject();
        } else {
          console.log('no err on makeReq');
          resolve({ res: res, body: body });
        }
      })
    })
  };
  
  this.isLoginRequired = function (url) {
    return new Promise(function (resolve, reject) {
      request.get(url, function (err, res) {
        if (err) {
          return console.error(err);
          reject();
        }
        var key_string = '/opensso/UI/Login';
        console.log('Res from checking login: ' + JSON.stringify(res));
        resolve(JSON.stringify(res).includes(key_string));
      })
    })
  };

  this.isCallAsync = function (url) {
    console.log('Testing : ' + url + ' to see if async');
    return new Promise(function (resolve) {
      self.isLoginRequired(url).then(function (login_req) {
        //console.log(login_req);
        if (login_req) {
          console.log('Login is req so is async: ' + url);
          self.authorize().then(function () {
            self.makeRequest(url).then(function (response) {
              console.log(JSON.stringify('Resp from makeReq: ' + response));
              if(response.res.headers['content-type'] === 'application/xml') {
                //console.log(response.body);
                console.log('Is Async?: ' + response.body.includes('\<Enqueued\>'));
                resolve(true);
              } else {
                console.log('False, is not async...: ' + url);
                resolve(false);
              }
            });
          });
        } else {
          console.log('Login is not req so not async: ' + url);
          resolve(false);
        }
      });
    });
  };
}

var parser = new AsyncParser();
parser.isCallAsync('https://play.google.com/music/listen#/album/Bjrbycx5ipkoauduybmmwsh24ga/Edward+Sharpe+%26+The+Magnetic+Zeros/PersonA')
  .then(function (is_async) {
    console.log(is_async);
  });

parser.isCallAsync('https://ops.lmmp.nasa.gov/LMMP/rest/hazard/result')
  .then(function (is_async) {
    console.log(is_async);
  });



module.exports = AsyncParser;