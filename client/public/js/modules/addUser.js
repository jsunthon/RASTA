var addUser = angular.module('addUser', ['ngCookies']);

addUser.service('userService', function ($http, $location) {
  this.getUsers = function () {
    return $http.get('/api/users').then(function (response) {
      return response.data;
    })
  }

  this.removeUser = function (user) {
    return $http.post('/api/removeUser' + "/" + user).then(function (response) {
      return response.data;
    });
  }

  this.addUser = function (user, password) {
    return $http.post('/api/signup' + '/' + user + '/' + password).then(function (response) {
      return response.data;
    });
  }

});


addUser.controller('addCtrl', ['$scope', '$http', '$cookies', '$location', '$timeout', 'userService', function ($scope, $http, $cookies, $location, $timeout, userService) {
  var baseUrl = "/api/signup";


  userService.getUsers().then(function (response) {
    $scope.users = response.users;
  });

  $scope.removeUser = function (user) {
    userService.removeUser(user).then(function (response) {
      userService.getUsers().then(function (response) {
        $scope.users = response.users;
      });
    });
  }

  $scope.addUser = function () {
    userService.addUser($scope.username, $scope.password).then(function (response) {
      userService.getUsers().then(function (response) {
        $scope.users = response.users;
      });
    });
  }
}]);