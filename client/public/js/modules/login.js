// signup module w/ signup ctrl
var login = angular.module('login', ['ngCookies']);

login.controller('loginCtrl', ['$scope', '$http', '$cookies', '$location', function ($scope, $http, $cookies, $location) {
  var baseUrl = "/api/authenticate";

  if (!$cookies.get('token')) {
    $scope.notLoggedIn = true;
  }

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
          document.getElementById("uploadButton").style.display = "block";
          var a = document.createElement('a');
          a.setAttribute('href', '#/logout');
          a.innerHTML = "<i class=\"fa fa-eject\" aria-hidden=\"true\"></i>&nbsp;&nbsp;&nbsp;Logout";
          document.getElementById('logout').appendChild(a);
          $location.path('#/home');
        }
      });
  };
}]);