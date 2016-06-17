/**
 * Created by jsunthon on 6/17/16.
 */

//module and ctrl for signing up
var signup = angular.module('signup', []);

signup.controller('signupCtrl', ['$scope', '$http', function ($scope, $http) {
  $scope.signupTest = "Signup page";
}]);