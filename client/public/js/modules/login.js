/**
 * Created by jsunthon on 5/19/2016.
 */

// signup module w/ signup ctrl
var login = angular.module('login', []);

login.controller('loginCtrl', ['$scope', '$http', function ($scope, $http) {

  $scope.loginTest = "Login page";

}]);