'use strict';

var charts = angular.module('charts', ['chart.js', 'ngMaterial', 'ngMessages']);

charts.config(['ChartJsProvider', function (ChartJsProvider) {
  // Configure all charts
  ChartJsProvider.setOptions({
    colours: ['#46BFBD'],
    responsive: true
  });
}]);

charts.service('updateChartData', function($http) {
  this.fetchServAvailByDate = function(date) {
    return $http.get('/api/getAvailByDate/' + date).then(function(response) {
      return response.data;
    });
  }
});

/**
 * Service that formats chart labels and data nicely.
 */
charts.service('format', function() {
  this.formatDateLabels = function(isoDate) {
    var date = new Date(isoDate);
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

charts.controller('chartCtrl', function ($scope, $timeout, $http, format, lastUpdateService, updateChartData) {

  $scope.servAvailDate = new Date();

  $scope.fetchServAvailByDate = function(date) {
    $scope.fetchServDataResMsg = false;
    updateChartData.fetchServAvailByDate(date).then(function(response) {
      if (response.validDate) {
        if (response.resultsFound) {
          $scope.servAvailStatData = [Number(response.avail).toFixed(2), Number(response.unavail).toFixed(2)];
          $scope.servAvailStatLabels = ["Available", "Unavailable"];
          $scope.overallServLoad = false;
        } else {
          $scope.fetchServDataResMsg = response.message;
        }
      } else {
        $scope.fetchServDataResMsg = response.message;
      }

      if ($scope.fetchServDataResMsg) {
        setTimeout(function() {
          $scope.fetchServDataResMsg = false;
        }, 3000);
      }
    });
  }

  //set the options for the line charts
  $scope.options = {
    scales: {
      yAxes: [{
        ticks: {
          max: 1,
          min: 0,
          stepSize: 0.1
        },
        scaleLabel: {
          display: true,
          labelString: 'Availability',
          fontColor: '#F5F5F5'
        }
      }],
      xAxes: [{
        scaleLabel: {
          display: true,
          labelString: 'Test Date',
          fontColor: '#F5F5F5'
        }
      }]
    },
    tooltips: {
      callbacks: {
        label: function(tooltipItem, data) {
          var data = data.datasets[0].data; //array of data objects.
          var toolTipDataInd = tooltipItem.index;
          var avail = data[toolTipDataInd] * 100;
          return "Overall service availability: " + avail + '%';
        }
      }
    }
  };

  //set the options for the line charts
  $scope.funcServOptions = {
    scales: {
      yAxes: [{
        ticks: {
          max: 1,
          min: 0,
          stepSize: 0.1
        },
        scaleLabel: {
          display: true,
          labelString: 'Availability',
          fontColor: '#F5F5F5'
        }
      }],
      xAxes: [{
        scaleLabel: {
          display: true,
          labelString: 'Test Date',
          fontColor: '#F5F5F5'
        }
      }]
    },
    tooltips: {
      callbacks: {
        label: function(tooltipItem, data) {
          var data = data.datasets[0].data; //array of data objects.
          var toolTipDataInd = tooltipItem.index;
          var avail = data[toolTipDataInd] * 100;
          return "Overall service availability: " + avail + '%';
        }
      }
    },
    title: {
      display: true,
      fontColor: '#F5F5F5',
      text: '',
      fullWidth: true
    }
  };

  $scope.pieOptions = {
    legend: {
      display: true,
      labels: {
        fontColor: 'rgb(245, 245, 245)'
      }
    },
    tooltips: {
      callbacks: {
        label: function(tooltipItem, data) {
          var data = data.datasets[0].data; //array of data objects.
          var toolTipDataInd = tooltipItem.index;
          return data[toolTipDataInd] + '%';
        }
      }
    }
  }

  $scope.overallServLoad = true;
  $scope.functionsLoad = true;

  $http.get("/api/get_service_status").success(function (response) {
    $scope.overallServStatLabels = response.labels.map(format.formatDateLabels);
    var lastLabelIndex = $scope.overallServStatLabels.length - 1;
    lastUpdateService.setUpdated($scope.overallServStatLabels[lastLabelIndex]);
    $scope.lastUpdated = lastUpdateService.lastUpdated;
    $scope.overallServStatData = [format.formatDecData(response.data)];
    $scope.overallServStatSeries = ["Overall Service Status"];
    var availData = $scope.overallServStatData[0];
    var avail = availData[availData.length - 1] * 100;
    var unavail = 100 - avail;
    $scope.servAvailStatData = format.formatDecData([avail, unavail]);
    $scope.servAvailStatLabels = ["Available", "Unavailable"];
    $scope.overallServLoad = false;
  });

  $http.get("/api/getFuncNames").success(function (response) {
    $scope.funcArr = response;
    $scope.functionsLoad = false;
  });

  //handles the event that a function is selected
  $scope.retrieveFuncData = function (functionSelected) {
    var funcName = functionSelected.name;
    $http.get('/api/getFunctionData/' + funcName).success(function (response) {
      $timeout(function() {
        $scope.funcStatData = [format.formatDecData(response.data)];
        $scope.funcStatSeries = funcName;
        $scope.funcServLabel = funcName + "'s";
        $scope.funcStatLabels = response.labels.map(format.formatDateLabels);
        $scope.funcSelected = true;
        $http.get('/api/getFuncServNames/' + funcName).success(function(response) {
          $scope.funcServSelected = true;
          $scope.functionsServNameLoad = false;
          $scope.funcServDataLoaded = false;
          $scope.funcServices = response;
        });
      }, 0);
    });
  }

  //when a service is selected, load the data to populate the chart
  $scope.retrieveFuncServData = function (funcServSelected) {
      var funcServName = funcServSelected.name;
      $http.get('/api/getFuncServData/' + funcServName).success(function (response) {
        $timeout(function () {
          $scope.funcServStatData = [format.formatDecData(response.data)];
          $scope.funcServStatSeries = [funcServName];
          $scope.funcServStatLabels = response.labels.map(format.formatDateLabels);
          $scope.funcServDataLoaded = true;
          $scope.funcServOptions.title.text = funcServSelected.testUrl;
        }, 0);
      });
  }
});