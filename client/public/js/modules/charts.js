'use strict';

var charts = angular.module('charts', ['chart.js', 'ngMaterial']);

charts.config(['ChartJsProvider', function (ChartJsProvider) {
  // Configure all charts
  ChartJsProvider.setOptions({
    colours: ['#46BFBD'],
    responsive: true
  });
}]);

charts.service('updateChartData', function ($http) {
  this.fetchServAvailByDate = function (date) {
    return $http.get('/api/getAvailByDate/' + date).then(function (response) {
      return response.data;
    });
  }
});

/**
 * Service that formats chart labels and data nicely.
 */
charts.service('format', function () {
  this.formatDecData = function (dataSeries) {
    return dataSeries.map(function (data) {
      return Number(data).toFixed(2);
    });
  }
});

charts.controller('chartCtrl', function ($scope, $timeout, $http, format, updateChartData) {

  $scope.servAvailDate = new Date();

  $scope.fetchServAvailByDate = function (date) {
    $scope.fetchServDataResMsg = false;
    updateChartData.fetchServAvailByDate(date).then(function (response) {
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
        setTimeout(function () {
          $scope.fetchServDataResMsg = false;
          $scope.servAvailDate = new Date();
        }, 3000);
      }
    });
  }

  $scope.fetchServAvailByDate($scope.servAvailDate);

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
        label: function (tooltipItem, data) {
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
        label: function (tooltipItem, data) {
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
        label: function (tooltipItem, data) {
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
    $scope.overallServStatLabels = response.labels;
    $scope.overallServStatData = [format.formatDecData(response.data)];
    $scope.overallServStatSeries = ["Overall Service Status"];
    $scope.overallServLoad = false;
  });

  $http.get("/api/getFuncNames").success(function (response) {
    $scope.funcArr = response;
    $scope.functionsLoad = false;
  });

  //handles the event that a function is selected
  $scope.retrieveFuncData = function (functionSelected) {
    var funcName = functionSelected.name;
    $scope.funcDataLoading = true;
    $http.get('/api/getFunctionData/' + funcName).success(function (response) {
      $timeout(function () {
        $scope.funcStatData = [format.formatDecData(response.data)];
        $scope.funcStatSeries = funcName;
        $scope.funcServLabel = funcName + "'s";
        $scope.funcStatLabels = response.labels;
        $scope.funcDataLoading = false;
        $http.get('/api/getFuncServNames/' + funcName).success(function (response) {
          $scope.funcServSelected = true;
          $scope.functionsServNameLoad = false;
          $scope.funcServices = response;
          console.log('Func services: ' + JSON.stringify($scope.funcServices));
        });
      }, 0);
    });
  }

  //when a service is selected, load the data to populate the chart
  $scope.retrieveFuncServData = function (funcServSelected) {
    if (funcServSelected !== undefined && funcServSelected !== null) {
      var funcServName = funcServSelected.name;
      $scope.funcServDataLoading = true;
      $http.get('/api/getFuncServData/' + funcServName).success(function (response) {
        $timeout(function () {
          $scope.funcServStatData = [format.formatDecData(response.data)];
          $scope.funcServStatSeries = [funcServName];
          $scope.funcServStatLabels = response.labels;
          $scope.funcServDataLoading = false;
          $scope.funcServOptions.title.text = funcServSelected.testUrl;
        }, 0);
      });
    }
  }

  $scope.pieClick = function(evt) {
    var myPieChart = document.getElementById("servAvailStat");
    var activePoints = myPieChart.getPointsAtEvent(evt);
    console.log("active: " + activePoints);
  }
});