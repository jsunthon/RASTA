var AsyncModel = require('./../models/async_call');
var db = require('./dbInit').goose;

function AsyncCallDbManager() {

  var self = this;
  
  this.parseThenInsert = function (url, date, name, response_type, request_type, time_out, checker_url) {
    console.log('parseThenInsert: ' + url);
    return new Promise(function (resolve, reject) {
      var async_call_obj = {
        date: date,
        job_creator: {}
      };
      var url_split = url.split('?');
      console.log('url split: ' + url_split);
      if (url_split.length !== 2) {
        console.log('len not valid');
        reject();
      }
      else {
        console.log('urlsplit[0]' + url_split[0])
        async_call_obj.job_creator.base_url = url_split[0];
        console.log(JSON.stringify(async_call_obj));
        var url_slash_split = url_split[0].split('/');
        console.log('AFter url slash split: ' + JSON.stringify(async_call_obj));
        async_call_obj = addAttrsIfPresent(async_call_obj, url_slash_split);
        console.log('After add attrs: ' + JSON.stringify(async_call_obj));
        var params = url_split[1].split('&');
        async_call_obj.job_creator.parameters = [[]];
        params.map(function (param) {
          var param_pair = param.split('=');
          var param_obj = { name: param_pair[0], value: param_pair[1] };
          async_call_obj.job_creator.parameters[0].push(param_obj);
        });
        self.insertAsyncCall(async_call_obj).then(function () {
          resolve();
        });
      }
    });

    function addAttrsIfPresent(async_call_obj, url_slash_split) {
      if (name) {
        async_call_obj.name = name;
      } else {
        async_call_obj.name = url_slash_split[url_slash_split.length - 1];
      }

      if (response_type) {
        async_call_obj.response_type = response_type;
      }

      if (request_type) {
        async_call_obj.request_type = request_type;
      }

      if (checker_url) {
        async_call_obj.job_checker = checker_url;
      } else {
        async_call_obj.job_checker = async_call_obj.job_creator.base_url + '/result';
      }

      if (time_out) {
        async_call_obj.time_out = time_out
      }
      return async_call_obj;
    }
  };


  this.insertAsyncCall = function (call_obj) {
    return new Promise(function (resolve, reject) {
      var async_model = new AsyncModel(call_obj);
      async_model.save(function (err, saved_obj) {
        if (err) {
          console.error(err);
          reject();
        } else {
          console.log('Successfully saved: ' + JSON.stringify(saved_obj));
          resolve();
        }
      });
    })
  };
  
  this.retrieveAsyncCall = function () {
    return new Promise(function (resolve, reject) {
      AsyncModel.find(function (err, found_calls) {
        if (err) {
          console.error(err);
          reject();
        } else {
          resolve(found_calls);
        }
      });
    });
  };

  this.retrieveACall = function (url) {
    return new Promise(function (resolve) {
      var base_url = url.split('?')[0];
      console.log('base:url: ' + base_url);
      AsyncModel.findOne({'job_creator.base_url': base_url}, function (found_call) {
        if (found_call) {
         console.log('Found call: ' + JSON.stringify(found_call));
        }
        resolve(found_call);
      })
    });
  }
}

module.exports = AsyncCallDbManager;