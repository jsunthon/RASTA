var upload = angular.module('upload', []);

upload.directive('fileModel', ['$parse', function ($parse) {
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      var model = $parse(attrs.fileModel);
      var modelSetter = model.assign;

      element.bind('change', function(){
        scope.$apply(function(){
          modelSetter(scope, element[0].files[0]);
        });
      });
    }
  };
}]);


upload.controller('uploadCtrl', ['$scope', '$http', '$location', function ($scope, $http, $location) {
  $scope.jsonRsp = "";
  $scope.jsonUploaded = false;

  $scope.uploadFile = function(){
    var file = $scope.myFile;
    console.dir(file);
    var uploadUrl = "/api/post_api_list";
    $scope.jsonRsp = uploadFileToUrl(file, uploadUrl);
  };

  var uploadFileToUrl = function(file, uploadUrl){
    var fd = new FormData();
    fd.append('file', file);

    var value = fd.get('file'); //get a reference to the fd file

    $http.post(uploadUrl, value, {headers: {'Content-Type': 'application/json'}})
      .success(function(res) {
        $scope.jsonRsp = JSON.stringify(res, null, 2);
        $scope.jsonUploaded = true;
      })
      .error(function() {
        $scope.jsonRsp = "upload unsuccessful.";
      });
  }
}]);