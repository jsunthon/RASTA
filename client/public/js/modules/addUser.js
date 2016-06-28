var addUser = angular.module('addUser', ['ngCookies']);

addUser.controller('addCtrl', ['$scope', '$http', '$cookies', '$location', function ($scope, $http, $cookies, $location) {
  var baseUrl = "/api/signup";

  $scope.addUser = function () {
    $http.post(baseUrl + "/" + $scope.username + "/" + $scope.password)
      .success(function (response) {
        $location.search('key', null)
      })
  };
}]);