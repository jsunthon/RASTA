var addUser = angular.module('addUser', []);

addUser.service('userService', function ($http, $cookies) {
  this.getUsers = function () {
    return $http.get('/api/users').then(function (response) {
      return response.data;
    })
  }

  this.removeUser = function (user) {
    return $http.post('/api/removeUser' + "/" + user.name).then(function (response) {
      return response.data;
    });
  }

  this.addUser = function (user, password) {
    return $http.post('/api/signup' + '/' + user + '/' + password + '/' + $cookies.get('name')).then(function (response) {
      document.getElementById("addUserForm").reset();
      return response.data;
    });
  }
});

addUser.controller('addCtrl', ['$scope', '$http', '$location', '$timeout', 'userService', 'validateUserService', function ($scope, $http, $location, $timeout, userService, validateUserService) {
  validateUserService.validateUser().then(function(response) {
    $scope.validUser = response;
  });

  userService.getUsers().then(function (response) {
    $scope.users = response;
  });

  $scope.removeUser = function (user) {
    userService.removeUser(user).then(function (response) {
      userService.getUsers().then(function (response) {
        $scope.users = response;
      });
    });
  }

  $scope.addUser = function () {
    userService.addUser($scope.username, $scope.password).then(function (response) {
      if (!response.success) {
        document.getElementById("addUserContainer").className = "animated fadeIn ng-hide text-danger";
      } else {
        document.getElementById("addUserContainer").className = "animated fadeIn ng-hide text-success";
      }
      $scope.addUserAttempt = true;
      $scope.addedStatus = response.msg;
      $timeout(function() {
        $scope.addUserAttempt = false;
      }, 5000);
      userService.getUsers().then(function (response) {
        $scope.users = response;
      });
    });
  }

  $scope.backToAcc = function() {
    $location.path('/login');
  }
}]);