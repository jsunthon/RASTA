// signup module w/ signup ctrl
var login = angular.module('login', ['ngCookies']);

login.controller('loginCtrl', ['$scope', '$http', '$cookies', '$location', function ($scope, $http, $cookies, $location) {
  var baseUrl = "/api/authenticate";

  if (!$cookies.get('token')) {
    $scope.notLoggedIn = true;
    $scope.loggedIn = false;

  }
  else {
    $scope.loggedIn = true;
    $scope.notLoggedIn = false;
  }

  $scope.login = function () {
    $http.post(baseUrl + "/" + $scope.username + "/" + $scope.password)
      .success(function (response) {
        $location.search('key', null)
        if(response[0] == false){
          console.log("kdsfkasdhgfkhjsdagaf " + response);
        }
        console.log("asd: " + response);
        var token = response.token.split(' ')[1];
        var name = response.name;
        //set the cookie
        $cookies.put('token', token);
        $cookies.put('name', name);

        if ($cookies.get('token')) {
          $scope.notLoggedIn = false;
          $scope.loggedIn = true;

          document.getElementById("uploadButton").style.display = "block";
          var a = document.createElement('a');
          a.setAttribute('href', '#/logout');
          a.innerHTML = "<i class=\"fa fa-eject\" aria-hidden=\"true\"></i>&nbsp;&nbsp;&nbsp;Logout";
          document.getElementById('logout').appendChild(a);
          $location.path('#/home');
        }
      }).error(function (response) {
          console.log("You fucked up the login dawg!");
    });
  };
}]);