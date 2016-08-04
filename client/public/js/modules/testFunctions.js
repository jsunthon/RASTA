var testFunctions = angular.module('testFunctions', ['ui.scroll', 'ui.scroll.jqlite', 'ngMaterial']);

testFunctions.service('functionTester', function ($http) {
  this.testFunction = function (functionObj) {
    return $http.post('/api/testFunction', functionObj, {headers: {'Content-Type': 'application/json'}}).then(function (response) {
      return response.data;
    });
  }
});

testFunctions.service('functionSearch', function() {
  var functionsArr = [];

  this.setFunctions = function(functions) {
    functionsArr = functions;
  }

  this.querySearch = function (query) {
    return query ? functionsArr.filter(createFilterFor(query)) : functionsArr;
  }

  function createFilterFor(query) {
    var lowercaseQuery = angular.lowercase(query);
    return function filterFn(func) {
      if (func) {
        return (func.funcName.indexOf(lowercaseQuery) === 0);
      }
    };
  }
});

testFunctions.factory('getFunctions', function ($http, $timeout, $rootScope) {
  var functions = [];

  var getFunctions = function () {
    return $http.get('/api/getAllFunctions').then(function (response) {
      return response.data;
    });
  }

  var formatFuncTableData = function (response) {
    return response.map(function (res) {
      var funcName = res._id;
      var funcId = res.id;
      var serviceNames = res.services.map(function (serviceArr) {
        var serviceSingleton = serviceArr[0];
        var serviceName = serviceSingleton.name;
        return serviceName;
      }).sort();

      var serviceNamesStr = serviceNames.reduce(function (previousValue, currentValue) {
        return previousValue + ", " + currentValue;
      });

      var serviceObjArr = res.services.reduce(function (prev, curr) {
        return prev.concat(curr);
      }).sort(function (servA, servB) {
        if (servA.name > servB.name) {
          return 1;
        }
        if (servA.name < servB.name) {
          return -1;
        }
        return 0;
      });

      return {
        funcId: funcId,
        funcName: funcName,
        serviceNames: serviceNamesStr,
        services: serviceObjArr
      };
    });
  }

  var refreshData = function () {
    return getFunctions().then(function (response) {
      functions = formatFuncTableData(response);
      return functions;
    });
  }

  var position = 0;

  var get = function (index, count, success) {
    return $timeout(function () {
      var actualIndex = index + position;
      var start = Math.max(0 - position, actualIndex);
      var end = Math.min(actualIndex + count - 1, functions.length);

      if (start > end) {
        success([]);
      } else {
        success(functions.slice(start, end + 1));
      }
    }, 100);
  };
  
  return {
    get: get,
    refreshData: refreshData
  };
});

testFunctions.controller('testFunctionsCtrl', ['$scope', '$http', '$location', 'getFunctions', 'functionTester', 'functionSearch', 'validateUserService', 'testUtilities',
  function ($scope, $http, $location, getFunctions, functionTester, functionSearch, validateUserService, testUtilities) {

    validateUserService.validateUser().then(function (response) {
      $scope.validUser = response;
    });

    $scope.$on('$routeChangeSuccess', function () {
      getFunctions.refreshData().then(function(functions) {
        functionSearch.setFunctions(functions);
      });
    });

    $scope.testFunction = function (functionObj) {
      $scope.showFunctionTestRes = false;
      $scope.functionTestResLoading = true;
      functionTester.testFunction(functionObj).then(function (response) {
        $scope.functionTestResLoading = false;
        var funcTestResIcon = document.getElementById("funcTestResIcon");
        testUtilities.updateStatusIcon(funcTestResIcon, response);
        $scope.funcTestedName = functionObj.funcName;
        $scope.functionTestResults = response; //an array of results objs
        var testDate = new Date(response[0].testDate);
        $scope.functionTestDate = testDate.today() + ' @ ' + testDate.timeNow();
        $scope.showFunctionTestRes = true;
      });
    }

    $scope.querySearch = function(query) {
      return functionSearch.querySearch(query);
    }
  }]);