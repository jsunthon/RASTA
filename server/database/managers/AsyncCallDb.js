var AsyncModel = require('./../models/async_call');
var db = require('./dbInit').goose;

function AsyncCallDbManager() {

  var self = this;
  this.parseThenInsert = function (url, date) {
    return Promise(function (resolve, reject) {
      var async_call_obj = {
        
      };
      var url_split = url.split('?');
      if (url_split.length !== 2) reject();
      else {
        async_call_obj.base_url = url_split[0];
        var params = url_split[1].split('&');
        async_call_obj.parameters = [[]];
        params.map(function (param) {
          var param_pair = param.split('=');
          var param_obj = { name: param_pair[0], value: param_pair[1] };
          async_call_obj.parameters[0].push(param_obj);
        });
      }
    });
  };

  this.insertAsyncCall = function (call_obj) {
    
  };

}