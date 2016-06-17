var upload = angular.module('upload', []);

//controller for avg charts
//
upload.controller('uploadCtrl', ['$scope', '$http', '$location', function ($scope, $http, $location) {

  $scope.uploadTest = "Upload page";

  // $scope.avgDataSource = {}; //declare the data source; initially empty
  // $scope.wsdlServices;
  // $scope.wsName = '';
  // $scope.wsUri = '';
  //
  // //on page load, retrive list of wsdl services from wb and populate the scope
  // $scope.$on('$routeChangeSuccess', function () {
  //   (function () {
  //     $http.get("/client/v1/wsdl/getServices").success(function (response) {
  //       $scope.wsdlServices = response;
  //     });
  //   })();
  // });
  //
  // $scope.saveWS = function() {
  //   $http.get("/client/v1/wsdl/saveWsdl", {
  //     params: {
  //       name: $scope.wsName,
  //       uri: $scope.wsUri
  //     }
  //   }).success(function (response) {
  //     $http.get("/client/v1/wsdl/getServices").success(function (response) {
  //       $scope.wsdlServices = response;
  //     });
  //   });
  // }
  //
  // $scope.test = function(serviceId) {
  //   console.log("service id: " + serviceId);
  //   $location.path('/new-project/' + serviceId);
  // }
}]);