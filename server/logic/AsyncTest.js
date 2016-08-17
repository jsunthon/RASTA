var request = require('request').defaults({jar: true});
var AsyncCallDbManager = require('../database/managers/AsyncCallDb');
var AsyncResultModel = require('../database/models/async_call_result');
var parser = require('xml2js').parseString;

function AsyncTest() {
  var self = this;

  this.dbManager = new AsyncCallDbManager();

  this.submitJobs = function () {
    self.dbManager.retrieveAsyncCall().then(function (call_objs) {
      var urls = self.createAllUrls(call_objs);
      console.log('urls: ss' + urls);
      self.createJobs(urls);
    });
  };

  this.testJobs = function () {
    self.dbManager.retrieveAsyncCall().then(function (call_objs) {
      var checker_urls = call_objs.map(function (call_obj) {
        return call_obj.job_checker;
      });
      checker_urls.reduce(function (pre, cur) {
        pre.then(function () {
          return self.testAsynceProgress(cur);
        })
      }, Promise.resolve());
    });
  };

  this.createAllUrls = function (call_objs) {
    var urls_list = call_objs.map(function (call_obj) {
      return self.createAUrlGroup(call_obj.job_creator.base_url, call_obj.job_creator.parameters);
    });
    console.log('url list: ' + urls_list);
    return urls_list.reduce(function (pre, cur) {
      return pre.concat(cur);
    }, []);
  };

  this.createAUrlGroup = function (base_url, params_list) {
    return params_list.map(function (params) {
      return self.createAUrl(base_url, params);
    });
  };

  this.createAUrl = function (base_url, params) {
    var params = params.reduce(function (pre, cur, idx, arr) {
      if (idx < arr.length - 1) {
        return pre + cur.name + '=' + cur.value + '&';
      } else if (idx === arr.length - 1) {
        return pre + cur.name + '=' + cur.value;
      } else {
        return pre;
      }
    }, '?');
    return base_url + params;
  };

  this.createJobs = function (urls) {
    urls.map(function (url) {
      self.createAJob(url);
    })
  };

  this.createAJob = function (url) {
    self.authorize().then(function () {
      var start_time = new Date().valueOf();
      request.get(url, function (err, res) {
        if (err) {
          console.error(err);
        } else if (res.statusCode !== 200) {
          var end_time = new Date().valueOf();
          var res_time = end_time - start_time;
          self.createATestResult(url, res, res_time);
        }
      });
    });
  };

  this.createATestResult = function (url, response, res_time) {
    return new Promise(function (resolve) {
      self.dbManager.retrieveACall(url).then(function (call_obj) {
        var result = new AsyncResultModel({
          service_id: call_obj._id,
          service_name: call_obj.name,
          test_result: 0,
          status_code: response.statusCode,
          response_time: res_time
        });
        result.save(function (err, saved_result) {
          resolve();
        })
      })
    })
  };

  this.authorize = function () {
    console.log('calling this.authorize');
    var login_url = 'https://ops.lmmp.nasa.gov/opensso/UI/Login';
    var credential_form = {form: {IDToken1: 'lmmpdev', IDToken2: 'devlmmp'}};
    return new Promise(function (resolve, reject) {
      request.post(login_url, credential_form, function (err) {
        if (err) {
          console.error(err);
          reject();
        } else {
          console.log('successfully authorized.');
          resolve();
        }
      })
    });
  };

  this.testAsynceProgress = function (url) {
    console.log('url async prog: ' + url);
    return new Promise(function (resolve) {
      self.authorize().then(function () {
        request.get(url, function (err, res, body) {
          console.log('res: ' + JSON.stringify(res));
          console.log('body: ' + JSON.stringify(body));
          parser(body, function (err, result) {
            var keys = Object.keys(result.Result);
            var arr = result.Result[keys[0]];
            console.log(keys);
            arr.map(function (em) {
              self.checkOneResult(em, url, res)
            });
          });
        });
      });
    });
  };

  this.checkOneResult = function (result, url, response) {
    return new Promise(function (resolve) {
      var que_date = new Date(result.Status[0].Enquequed[0]);
      var cur_date = new Date().valueOf();
      var hours_elapse = (cur_date - que_date) / 1000 / 3600;
      console.log('hours_elapse' + hours_elapse);
      console.log(JSON.stringify(result));
      if (hours_elapse < 25 && hours_elapse > 23) {
        if (result.Status.Completed === undefined) {
          self.dbManager.retrieveACall(url).then(function (found_call) {
            if (found_call) {
              self.createATestResult(url, response, hours_elapse).then(resolve());
            }
          });
        }
      }
    });
  }
}


var tester = new AsyncTest();
// tester.testAsynceProgress('https://raw.githubusercontent.com/jsunthon/RASTA/master/sample_pages/result.xml?token=AJt5DRk2eiX8F5G6AYFQeW_11TVo09Apks5XvbiuwA%3D%3D');
// tester.submitJobs();
tester.testJobs();