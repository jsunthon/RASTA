'use strict';

var charts = angular.module('charts', ['chart.js']);

charts.config(['ChartJsProvider', function (ChartJsProvider) {
  // Configure all charts
  ChartJsProvider.setOptions({
    colours: ['#46BFBD'],
    responsive: true
  });
}]);

/**
 * Service that can test individual functions and services
 */
charts.service('testService', function ($http) {
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

/**
 * Service that formats chart labels and data nicely.
 */
charts.service('format', function() {
  this.formatDateLabels = function(isoDate) {
    var date = new Date(Number(isoDate));
    return date.today() + " @ " + date.timeNow();
  }

  this.formatDecData = function(dataSeries) {
    return dataSeries.map(function(data) {
      return Number(data).toFixed(2);
    });
  }

  Date.prototype.today = function () {
    return (((this.getMonth() + 1) < 10) ? "0" : "") + (this.getMonth() + 1) + "/" + ((this.getDate() < 10) ? "0" : "") + this.getDate() + "/" + this.getFullYear();
  }

  Date.prototype.timeNow = function () {
    return ((this.getHours() < 10) ? "0" : "") + this.getHours() + ":" + ((this.getMinutes() < 10) ? "0" : "") + this.getMinutes() + ":" + ((this.getSeconds() < 10) ? "0" : "") + this.getSeconds();
  }
})

charts.controller('chartCtrl', function ($scope, $timeout, $http, format) {
  var newDate = new Date();
  $scope.currTime = "Last Updated: " + newDate.today() + " @ " + newDate.timeNow();

  //get data for overall serv stats
  $http.get("/api/get_service_status").success(function (response) {

    $scope.overallServStatLabels = response.labels.map(format.formatDateLabels);
    $scope.overallServStatData = [format.formatDecData(response.data)];
    $scope.overallServStatSeries = ["Overall Service Status"];

    var availData = $scope.overallServStatData[0];
    var avail = availData[availData.length - 1] * 100;
    var unavail = 100 - avail;

    $scope.servAvailStatData = format.formatDecData([avail, unavail]);
    $scope.servAvailStatLabels = ["Available", "Unavailable"];
  });

  //get data for the function status
  $http.get("/api/get_function_status").success(function (response) {
    $scope.funcArr = response.functions; //an array of function objects
  });

  //handles the event that a function is selected
  $scope.updateFeatData = function (featureSelected) {
    $timeout(function () {
      $scope.funcStatData = [format.formatDecData(featureSelected.status.data)];
      $scope.funcStatSeries = [featureSelected.name];
      $scope.funcStatLabels = featureSelected.status.labels.map(format.formatDateLabels);
      $scope.funcSelected = true;

      getFunctionServices($scope.funcStatSeries);
    }, 0);
  }

  //for the function selected, get its services
  function getFunctionServices(funcName) {
    var baseUrl = "/api/get_service_status_by_function";
    $http.get(baseUrl + '/' + funcName).success(function (response) {
      $scope.funcServices = response.services;
      $scope.funcServSelected = false;
    });
  }

  //when a service is selected, load the data to populate the chart
  $scope.updateFuncServData = function (servSelected) {
    if (servSelected !== null) {
      $timeout(function () {
        $scope.funcServStatData = [format.formatDecData(
          servSelected.status.data
        )];
        $scope.funcServStatSeries = [servSelected.name];
        $scope.funcServStatLabels = servSelected.status.labels.map(format.formatDateLabels);
        $scope.funcServSelected = true;
      }, 0);
    }
  }
});