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

upload.service('fileUpload', ['$http', function ($http) {

  this.outputJson = function(file) {
    console.log(file.toJson);
  }

  this.uploadFileToUrl = function(file, uploadUrl){
    var fd = new FormData();
    fd.append('file', file);

    var value = fd.get('file'); //get a reference to the fd file
    // console.log(typeof(value));
    console.log("File contents after extraction:\n" + Object.keys(value));

    // //$http.post is (URl, data)
    // $http.post(uploadUrl, fd)
    //   .success(function(){
    //     console.log("Upload complete.");
    //     console.log(fd);
    //   })
    //   .error(function(){
    //     alert("Couldn't post the file upload.");
    //   });

    $http.post(uploadUrl, value, {headers: {'Content-Type': 'application/json'}})
      .success(function(res) {
        console.log(res);
        console.log("request successful.");
      })
      .error(function() {
        console.log("failed");
      });
  }
}]);


upload.controller('uploadCtrl', ['$scope', '$http', '$location', 'fileUpload', function ($scope, $http, $location, fileUpload) {
  $scope.uploadTest = "Upload page";
  $scope.uploadFile = function(){
    var file = $scope.myFile;
    console.dir(file);
    var uploadUrl = "/api/post_api_list";
    fileUpload.uploadFileToUrl(file, uploadUrl);
  };
}]);