// signup module w/ signup ctrl
var login = angular.module('login', ['ngCookies']);

login.controller('loginCtrl', ['$scope', '$http', '$cookies', function ($scope, $http, $cookies) {
  var baseUrl = "/api/authenticate";
  $scope.notLoggedIn = true;
  $scope.login = function () {
    $http.post(baseUrl + "/" + $scope.username + "/" + $scope.password)
      .success(function (response) {
        var token = response.token.split(' ')[1];
        var name = response.name;
        //set the cookie
        $cookies.put('token', token);
        $cookies.put('name', name);

        if ($cookies.get('token')) {
          $scope.notLoggedIn = false;
          var a = document.createElement('a');
          a.setAttribute('href', '#/logout');
          a.innerHTML = "Logout";
          document.getElementById('logout').appendChild(a);
        }
      });
  };
}]);