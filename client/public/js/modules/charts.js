'use strict';

var charts = angular.module('charts', ['chart.js', 'ngCookies']);

charts.config(['ChartJsProvider', function (ChartJsProvider) {
  // Configure all charts
  ChartJsProvider.setOptions({
    colours: ['#46BFBD'],
    responsive: true
  });
}]);

//Angular Service: Test Functoins and Services
charts.service('$testService', function ($http) {

  this.testFunction = function ($scope) {
    var baseUrl = "/api/testFunction/";
    var functionName = $scope.featureSelected.name;
    $http.get(baseUrl + functionName)
      .success(function (response) {
        console.log(response);
      });
  }

  this.testApiService = function ($scope) {
    var baseUrl = "/api/testApiService/";
    var serviceName = $scope.funcServ.name;
    $http.get(baseUrl + serviceName).success(function (response) {
      console.log(response);
    });
  }
});

charts.controller('chartCtrl', function ($scope, $timeout, $http, $testService, $cookies) {

  $scope.authenticated = $cookies.get('token');
  if ($scope.authenticated) {
    var name = $cookies.get('name');
    document.getElementById('loginStatus').innerHTML = "Welcome, " + name;
  }
  $scope.testFunction = function () {
    $testService.testFunction($scope);
  }

  $scope.testApiService = function () {
    $testService.testApiService($scope);
  }

  $scope.onClick = function (points, evt) {
    console.log(points, evt);
  };

  //Current Date
  Date.prototype.today = function () {
    return (((this.getMonth() + 1) < 10) ? "0" : "") + (this.getMonth() + 1) + "/" + ((this.getDate() < 10) ? "0" : "") + this.getDate() + "/" + this.getFullYear();
  }

  //Current Time
  Date.prototype.timeNow = function () {
    return ((this.getHours() < 10) ? "0" : "") + this.getHours() + ":" + ((this.getMinutes() < 10) ? "0" : "") + this.getMinutes() + ":" + ((this.getSeconds() < 10) ? "0" : "") + this.getSeconds();
  }

  var newDate = new Date();
  $scope.currTime = "Last Updated: " + newDate.today() + " @ " + newDate.timeNow();

  //get data for overall serv stats
  $http.get("/api/get_service_status").success(function (response) {

    $scope.overallServStatLabels = response.labels.map(function(isoDate) {
      var date = new Date(Number(isoDate));
      return date.today() + " @ " + date.timeNow();
    });

    $scope.overallServStatData = [response.data];
    $scope.overallServStatSeries = ["Overall Service Status"];
    var availData = $scope.overallServStatData[0];
    var avail = availData[availData.length - 1] * 100;
    var unavail = 100 - avail;
    $scope.servAvailStatData = [avail, unavail];
    $scope.servAvailStatLabels = ["Available", "Unavailable"];
  });

  //get data for the function status
  $http.get("/api/get_function_status").success(function (response) {
    $scope.funcArr = response.functions; //an array of function objects
  });

  //handles the event that a function is selected
  $scope.updateFeatData = function (featureSelected) {
    $timeout(function () {
      $scope.funcStatData = [
        featureSelected.status.data
      ];
      $scope.funcStatSeries = [featureSelected.name];
      $scope.funcStatLabels = featureSelected.status.labels;
      $scope.funcSelected = true;

      getFunctionServices($scope.funcStatSeries);
    }, 0);
  }

  function getFunctionServices(funcName) {
    var baseUrl = "/api/get_service_status_by_function";
    $http.get(baseUrl + "/function_name=" + funcName).success(function (response) {
      $scope.funcServices = response.services;
      $scope.funcServSelected = false;
    });
  }

  $scope.updateFuncServData = function (servSelected) {
    if (servSelected !== null) {
      $timeout(function () {
        $scope.funcServStatData = [
          servSelected.status.data
        ];
        $scope.funcServStatSeries = [servSelected.name];
        $scope.funcServStatLabels = servSelected.status.labels;
        $scope.funcServSelected = true;
      }, 0);
    }
  }
});


