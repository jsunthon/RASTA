var test = angular.module('test', []);

test.service('getService', function ($http) {

    this.getFunctions = function () {
        return $http.get('/api/getAllFunctions').then(function (response) {
            return response.data;
        });
    }

    this.formatFuncTableData = function (response) {
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

    this.getServices = function () {
        return $http.get('/api/getAllServices').then(function (response) {
            return response.data;
        });
    }
});

test.service('testingService', function ($http) {
    this.testFunction = function (functionObj) {
        return $http.post('/api/testFunction', functionObj, {headers: {'Content-Type': 'application/json'}}).then(function (response) {
            return response.data;
        });
    }

    this.testService = function (serviceObj) {
        return $http.post('/api/testService', serviceObj, {headers: {'Content-Type': 'application/json'}}).then(function (response) {
            return response.data;
        });
    }

    Date.prototype.today = function () {
        return (((this.getMonth() + 1) < 10) ? "0" : "") + (this.getMonth() + 1) + "/" + ((this.getDate() < 10) ? "0" : "") + this.getDate() + "/" + this.getFullYear();
    }

    Date.prototype.timeNow = function () {
        return ((this.getHours() < 10) ? "0" : "") + this.getHours() + ":" + ((this.getMinutes() < 10) ? "0" : "") + this.getMinutes() + ":" + ((this.getSeconds() < 10) ? "0" : "") + this.getSeconds();
    }

    this.updateStatusIcon = function(icon, results) {
        var successful = checkForFailures(results);
        if (successful) {
            icon.innerHTML = "<i class=\"fa fa-check-circle-o\" aria-hidden=\"true\"></i>";
        } else {
            icon.innerHTML = "<i class=\"fa fa-exclamation-triangle\" aria-hidden=\"true\"></i>";
        }
    }

    var checkForFailures = function(results) {
        return results.every(validateResultObj);
    }

    var validateResultObj = function(resultObj) {
        return resultObj.rspTime !== "FAIL";
    }
});

test.controller('testCtrl', ['$scope', '$http', 'getService', 'testingService', function ($scope, $http, getService, testingService) {

    $scope.sortFunctionType = 'funcName';
    $scope.sortFunctionReverse = false;
    $scope.searchFunction = '';

    getService.getFunctions().then(function (response) {
        $scope.functions = getService.formatFuncTableData(response);
    });

    $scope.testFunction = function (functionObj) {
        $scope.showFunctionTestRes = false;
        testingService.testFunction(functionObj).then(function (response) {
            var funcTestResIcon = document.getElementById("funcTestResIcon");
            testingService.updateStatusIcon(funcTestResIcon, response);
            $scope.funcTestedName = functionObj.funcName;
            $scope.functionTestResults = response; //an array of results objs
            var testDate = new Date(response[0].testDate);
            $scope.functionTestDate = testDate.today() + ' @ ' + testDate.timeNow();
            $scope.showFunctionTestRes = true;
        });
    }

    $scope.sortServiceType = 'name';
    $scope.sortServiceReverse = false;
    $scope.searchService = '';

    getService.getServices().then(function (response) {
        $scope.services = response;
    });

    $scope.testService = function (serviceObj) {
        $scope.showServiceTestRes = false;
        testingService.testService(serviceObj).then(function (response) {
            var servTestResIcon = document.getElementById("servTestResIcon");
            testingService.updateStatusIcon(servTestResIcon, [response]);
            $scope.serviceName = response.serviceName;
            $scope.urlTested = response.urlTested;
            $scope.rspTime = response.rspTime;
            $scope.expectedRspType = response.expectedType;
            $scope.receivedRspType = response.receivedType;
            $scope.result = response.result;
            $scope.statCode = response.statCode;
            var testDate = new Date(response.testDate);
            $scope.testDate = testDate.today() + ' @ ' + testDate.timeNow();
            $scope.showServiceTestRes = true;
        });
    }
}]);