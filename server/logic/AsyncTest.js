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
      console.log('urls: ' + urls);
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
    var check_credential_url = 'https://ops.lmmp.nasa.gov/opensso/identity/isTokenValid';
    return new Promise(function (resolve, reject) {
      request.get(check_credential_url, function (err, res, body) {
        var is_logged_in = (body.split('=')[1] === 'true');
        if (!is_logged_in) {
          request.post(login_url, credential_form, function (err) {
            if (err) {
              console.error(err);
              reject();
            } else {
              console.log('successfully authorized.');
              resolve();
            }
          });
        } else {
          resolve();
        }
      });

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
              if (arr.indexOf(em) === 0) {
                console.log('Result: ' + JSON.stringify(em));
              }
              self.checkOneResult(em, url, res)
            });
          });
        });
      });
    });
  };

  this.checkOneResult = function (result, url, response) {
    return new Promise(function (resolve) {
      var que_date = new Date(result.Status[0].Enqueued[0]);
      var cur_date = new Date().valueOf();
      var hours_elapse = (cur_date - que_date) / 1000 / 3600;
      console.log('hours_elapsed: ' + hours_elapse);
      console.log(JSON.stringify(result));
      if (hours_elapse >= 0) {
        if (result.Status.Completed === undefined) {
          console.log('undefined');
          console.log('url: ' + url);
          self.dbManager.retrieveACall(url).then(function (found_call) {
            if (found_call) {
              console.log('found call: ' + JSON.stringify(found_call));
              self.createATestResult(url, response, hours_elapse).then(resolve());
            }
          });
        }
      } else {
        console.log('Hours is not between 23 and 25.');
      }
    });
  };

  var result = {
    "WorkOrderID":[
      "d83140bb-0f8b-435f-93b0-8b92a48838bf"
    ],
    "SubmitterID":[
      "lmmpdev"
    ],
    "Status":[
      {
        "Enqueued":[
          "2013-09-03T23:31:56Z"
        ],
        "Initiated":[
          "2013-09-04T00:09:29Z"
        ],
        "Completed":[
          "2013-09-04T00:09:34Z"
        ],
        "Dequeued":[
          "2013-09-04T00:09:29Z"
        ],
        "WorkerStarted":[
          "2013-09-04T00:09:29Z"
        ],
        "WorkerEnded":[
          "2013-09-04T00:09:34Z"
        ]
      }
    ],
    "InputParams":[
      {
        "Parameter":[
          {
            "_":"rock",
            "$":{
              "name":"Hazard Type"
            }
          },
          {
            "_":"cfasfd",
            "$":{
              "name":"Plot Type"
            }
          },
          {
            "_":"-8.6931",
            "$":{
              "name":"Upper Lat"
            }
          },
          {
            "_":"15.6373",
            "$":{
              "name":"Upper Lon"
            }
          },
          {
            "_":"-9.6299",
            "$":{
              "name":"Lower Lat"
            }
          },
          {
            "_":"15.7361",
            "$":{
              "name":"Lower Lon"
            }
          },
          {
            "_":"async",
            "$":{
              "name":"Mode"
            }
          }
        ]
      }
    ],
    "Result":[
      {
        "Hazard":[
          {
            "RockAbundancePlot":[
              "https://ops.lmmp.nasa.gov/webdav/private/1378253369893_cfaplot.png"
            ],
            "RockDensityPlot":[
              "https://ops.lmmp.nasa.gov/webdav/private/1378253369893_sfdplot.png"
            ]
          }
        ]
      }
    ]
  }


  this.testCheckOneResult = function () {
    var que_date = new Date(result.Status[0].Enqueued[0]);
    var cur_date = new Date().valueOf();
    var hours_elapse = (cur_date - que_date) / 1000 / 3600;
    console.log('hours_elapse: ' + hours_elapse);
  }
}

// var tester = new AsyncTest();
// // tester.testAsynceProgress('https://raw.githubusercontent.com/jsunthon/RASTA/master/sample_pages/result.xml?token=AJt5DRk2eiX8F5G6AYFQeW_11TVo09Apks5XvbiuwA%3D%3D');
// tester.submitJobs();
// tester.testJobs();
// tester.testCheckOneResult();

module.exports = AsyncTest;