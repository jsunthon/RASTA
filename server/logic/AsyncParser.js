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
        if (err) {
          return console.error(err);
          reject();
        }
        var key_string = '/opensso/UI/Login';
        resolve(JSON.stringify(res).includes(key_string));
      })
    })
  };

  this.isCallAsync = function (url) {
    return new Promise(function (resolve) {
      self.isLoginRequired(url).then(function (login_req) {
        //console.log(login_req);
        if (login_req) {
          self.authorize().then(function () {
            self.makeRequest(url).then(function (response) {
              //console.log(response);
              if(response.res.headers['content-type'] === 'application/xml') {
                //console.log(response.body);
                resolve(response.body.includes('<Enqueued>'));
              } else {
                resolve(false);
              }
            });
          });
        } else {
          resolve(false);
        }
      });
    });
  };
}

module.exports = AsyncParser;