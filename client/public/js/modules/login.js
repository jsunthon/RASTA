// signup module w/ signup ctrl
var login = angular.module('login', ['ngCookies']);

login.controller('loginCtrl', ['$scope', '$http', '$cookies', function ($scope, $http, $cookies) {
  var baseUrl = "/api/authenticate";
  $scope.login = function() {
    $http.post(baseUrl + "/" + $scope.username + "/" + $scope.password)
      .success(function(response) {
        var token = response.token.split(' ')[1];
        var name = response.name;
        //set the cookie
        $cookies.put('token', token);
        $cookies.put('name', name);
      });
  };
}]);