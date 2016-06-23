var upload = angular.module('upload', []);

upload.directive('fileModel', ['$parse', function ($parse) {
  return {
    restrict: 'A',
    link: function (scope, element, attrs) {
      var model = $parse(attrs.fileModel);
      var modelSetter = model.assign;

      element.bind('change', function () {
        scope.$apply(function () {
          modelSetter(scope, element[0].files[0]);
        });
      });
    }
  };
}]);


upload.controller('uploadCtrl', ['$scope', '$http', '$location', function ($scope, $http, $location) {
  $scope.uploadFile = function () {
    var file = $scope.myFile;
    var uploadUrl = "/api/post_api_list";
    uploadFileToUrl(file, uploadUrl);
  };

  var uploadFileToUrl = function (file, uploadUrl) {
    $http.post(uploadUrl, file, {headers: {'Content-Type': 'application/json'}})
      .success(function (res) {
        $scope.jsonRsp = JSON.stringify(res, null, 2);
        $scope.jsonUploaded = true;
      })
      .error(function () {
        $scope.jsonRsp = "upload unsuccessful.";
      });
  }
}]);