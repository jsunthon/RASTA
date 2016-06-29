var addUser = angular.module('addUser', ['ngCookies']);

addUser.controller('addCtrl', ['$scope', '$http', '$cookies', '$location', '$timeout', function ($scope, $http, $cookies, $location, $timeout) {
  var baseUrl = "/api/signup";

  $scope.addUser = function () {
    $http.post(baseUrl + "/" + $scope.username + "/" + $scope.password)
      .success(function (response) {
        if(response.success){
          $location.search('key', null);
          var addedUser = 1;
          $location.path('/login/' + addedUser);
        }
        else {
          $scope.addedStatus = "Username exists, try again";
          $scope.notValid = true;
          $timeout(function() {
            $scope.notValid = false;
          }, 1500);
        }
      });
  };
}]);