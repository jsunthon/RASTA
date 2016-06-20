'use strict';

var charts = angular.module('charts', ['chart.js', 'ng-fusioncharts']);

charts.config(['ChartJsProvider', function (ChartJsProvider) {
  // Configure all charts
  ChartJsProvider.setOptions({
    colours: ['#FF5252', '#FF8A80'],
    responsive: true
  });
}]);

charts.controller('chartCtrl', function ($scope, $timeout) {

  //data for the overall service status
  $scope.overallServStatLabels = ["January", "February", "March", "April", "May", "June", "July"];
  $scope.overallServStatSeries = ['All Services'];
  $scope.overallServStatData = [
    [65, 59, 80, 81, 56, 55, 40]
  ];
  $scope.onClick = function (points, evt) {
    console.log(points, evt);
  };

  //data for service availability
  $scope.servAvailStatLabels = ["Up Time", "Down Time"];
  $scope.servAvailStatData = [30, 70];


  //array that holds the options for the "status by calls" chart
  $scope.featureCalls = [{
    "id": 1,
    "name": "Sun Angle Data Fetcher",
    "url": "http://pub.lmmp.nasa.gov:8083/getAzElfromT1/"
  }, {
    "id": 2,
    "name": "Crater Detection Data Fetcher",
    "url": "http://pub.lmmp.nasa.gov:8083/crossdomain.xml"
  }, {
    "id": 3,
    "name": "Zoom Data Consumption",
    "url": "http://50.18.111.140/crossdomain.xml"
  }
  ];


  //Current Date
  Date.prototype.today = function () {
    return (((this.getMonth() + 1) < 10) ? "0" : "") + (this.getMonth() + 1) + "/" + ((this.getDate() < 10) ? "0" : "") + this.getDate() + "/" + this.getFullYear();
  }

  //Current Time
  Date.prototype.timeNow = function () {
    return ((this.getHours() < 10) ? "0" : "") + this.getHours() + ":" + ((this.getMinutes() < 10) ? "0" : "") + this.getMinutes() + ":" + ((this.getSeconds() < 10) ? "0" : "") + this.getSeconds();
  }

  //array that holds the options for the "status by features" chart
  $scope.lmmpFeatures = [{
    "id": 1,
    "name": "Sun Angle",
    "labels": ["January", "February", "March", "April", "May", "June", "July"],
    "data": [65, 59, 80, 81, 56, 55, 40]
  }, {
    "id": 2,
    "name": "Crater Check",
    "labels": ["January", "February", "March", "April", "May", "June", "July"],
    "data": [1, 2, 5, 100, 20, 55, 40]
  }, {
    "id": 3,
    "name": "Rock Detector",
    "labels": ["January", "February", "March", "April", "May", "June", "July"],
    "data": [30, 10, 80, 10, 37, 55, 90]
  }
  ];

  // //data for Function status
  // $scope.funcStatLabels = ["January", "February", "March", "April", "May", "June", "July"];
  // $scope.funcStatSeries = ['Sun Angle Calculation'];
  // $scope.funcStatData = [
  //   [65, 59, 80, 81, 56, 55, 40]
  // ];

  var newDate = new Date();
  $scope.currTime = "Last Updated: " + newDate.today() + " @ " + newDate.timeNow();

  $scope.funcSelected = false;
  $scope.updateFeatData = function (featureSelected) {
    $timeout(function () {
      $scope.funcStatData = [
        featureSelected.data
      ];
      $scope.funcStatSeries = featureSelected.name;
      $scope.funcStatLabels = featureSelected.labels;
      $scope.funcSelected = true;
    }, 0);
  }


  //data for func service status
  $scope.funcServStatLabels = ["January", "February", "March", "April", "May", "June", "July"];
  $scope.funcServStatSeries = ['Get Sun Data'];
  $scope.funcServStatData = [
    [65, 59, 80, 81, 56, 55, 40]
  ];

  // $scope.servSelected = false;
  // $scope.updateServData = function (servSelected) {
  //   $timeout(function () {
  //     $scope.funcServStatLabels = [
  //       servSelected.
  //     ];
  //     $scope.funcStatSeries = featureSelected.name;
  //     $scope.funcStatLabels = featureSelected.labels;
  //     $scope.funcSelected = true;
  //   }, 0);
  // }
});





