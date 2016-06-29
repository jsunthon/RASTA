// signup module w/ signup ctrl
var login = angular.module('login', ['ngCookies']);

login.controller('loginCtrl', ['$scope', '$http', '$cookies', '$location', '$timeout', '$routeParams', 'navBarService', function ($scope, $http, $cookies, $location, $timeout, $routeParams, navBarService) {
  var baseUrl = "/api/authenticate";
  console.log(navBarService.loggedIn);
  $scope.$on('$routeChangeSuccess', function () {
    if ($routeParams.addedUser !== undefined && $routeParams.addedUser !== null) {
      $scope.addedUser = $routeParams.addedUser;
    }
    $scope.addedUserMsg = "Successfully added user";
    $timeout(function () {
      $scope.addedUser = false;
    }, 1500);
  });

  if (!$cookies.get('token')) {
    navBarService.loggedIn = false;
    navBarService.loggedOut = true;
  }
  else {
    navBarService.loggedIn = true;
    navBarService.loggedOut = false;
  }

  updateScope(navBarService.loggedIn, navBarService.loggedOut);
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
              navBarService.loggedIn = true;
              navBarService.loggedOut = false;
              navBarService.uploadShow = true;
              navBarService.showUserName = true;
              var name = $cookies.get('name');
              navBarService.setUserName(name);
              updateScope(navBarService.loggedIn, navBarService.loggedOut);
              $location.path('#/home');
            }
          } catch (err) {
            console.log("THE ERROR: " + err);
          }
        } else {
          $scope.statusMsg = "Wrong username or password";
          $scope.notValidCred = true;
          $timeout(function () {
            $scope.notValidCred = false;
          }, 1500);
        }
      });
  };

  function updateScope(loggedIn, loggedOut) {
    $scope.loggedIn = loggedIn;
    $scope.loggedOut = loggedOut;
  }
}]);