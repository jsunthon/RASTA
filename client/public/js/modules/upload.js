var upload = angular.module('upload', ['ngFileUpload']);

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

upload.service('uploader', function (Upload) {
  this.upload =  function(file) {
    Upload.upload({
      url: '/api/upload',
      data: {file: file}
    }).then(function(resp) {
      if(resp.data.error_code === 0){ //validate success
        alert('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data);
      } else {
        alert('an error occured: ' + JSON.stringify(resp.data.err_desc));
      }
    });
  }
});

upload.controller('uploadCtrl', ['$scope', '$http', '$timeout', 'validateUserService', 'uploader', function ($scope, $http, $timeout, validateUserService, uploader) {
  validateUserService.validateUser().then(function (response) {
    $scope.validUser = response;
  });

  $scope.submit = function(){ //function to call on form submit
    if ($scope.uploadForm.fileUp.$valid && $scope.fileUp) { //check if from is valid
      uploader.upload($scope.fileUp);
    }
  }

  // $scope.uploadFile = function () {
  //     if ($scope.jsonUploaded) {
  //         $scope.jsonUploaded = false;
  //     }
  //     var file = $scope.myFile;
  //     $scope.uploadAttempt = true;
  //     $scope.statusStyle = {
  //         "font-style": "italic",
  //         "font-weight": "bold"
  //     };
  //     if (file) {
  //         var uploadUrl = "/api/post_api_list";
  //         uploadFileToUrl(file, uploadUrl);
  //     } else {
  //         $scope.statusColor = "text-danger";
  //         $scope.uploadStatus = "No JSON file was selected.";
  //     }
  //     $timeout(function () {
  //         $scope.uploadAttempt = false;
  //     }, 3000);
  // };

  $scope.uploadFile = function () {
    if ($scope.jsonUploaded) {
      $scope.jsonUploaded = false;
    }
    var file = $scope.myFile;
    $scope.uploadAttempt = true;
    $scope.statusStyle = {
      "font-style": "italic",
      "font-weight": "bold"
    };
    if (file) {
      var uploadUrl = "/api/post_api_list";
      var fileRead = new FileReader();
      fileRead.onload = function (e) {
        console.log(e.target.result);
      }
      fileRead.readAsText(file);
      // uploadFileToUrl(file, uploadUrl);
    } else {
      $scope.statusColor = "text-danger";
      $scope.uploadStatus = "No JSON file was selected.";
    }
    $timeout(function () {
      $scope.uploadAttempt = false;
    }, 3000);
  };

  var uploadFileToUrl = function (file, uploadUrl) {
    $http.post(uploadUrl, file)
      .success(function (res) {
        $scope.jsonRsp = JSON.stringify(res, null, 2);
        $scope.jsonUploaded = true;
        $scope.statusColor = "text-success";
        $scope.uploadStatus = "Upload successfully processed.";
      })
      .error(function () {
        $scope.statusColor = "text-danger";
        $scope.uploadStatus = "Error in processing upload.";
      });
  }

  // var uploadFileToUrl = function (file, uploadUrl) {
  //     $http.post(uploadUrl, file, {headers: {'Content-Type': 'application/json'}})
  //         .success(function (res) {
  //             $scope.jsonRsp = JSON.stringify(res, null, 2);
  //             $scope.jsonUploaded = true;
  //             $scope.statusColor = "text-success";
  //             $scope.uploadStatus = "Upload successfully processed.";
  //         })
  //         .error(function () {
  //             $scope.statusColor = "text-danger";
  //             $scope.uploadStatus = "Error in processing upload.";
  //         });
  // }
}]);