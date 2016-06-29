// signup module w/ signup ctrl
var login = angular.module('login', ['ngCookies']);

login.controller('loginCtrl', ['$scope', '$http', '$cookies', '$location', '$timeout', '$routeParams', function ($scope, $http, $cookies, $location, $timeout, $routeParams) {
  var baseUrl = "/api/authenticate";

  $scope.$on('$routeChangeSuccess', function() {
    if ($routeParams.addedUser !== undefined && $routeParams.addedUser !== null) {
      $scope.addedUser = $routeParams.addedUser;
    }
    $scope.addedUserMsg = "Successfully added user";
    $timeout(function() {
      $scope.addedUser = false;
    }, 1500);
  });

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
        $location.search('key', null);
        if (response.success) {
          try {
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
          }catch(err){
            console.log("THE ERROR: " + err);
          }
        } else {
          $scope.statusMsg = "Wrong username or password";
          $scope.notValidCred = true;
          $timeout(function() {
            $scope.notValidCred = false;
          }, 1500);
        }
      });
  };
}]);