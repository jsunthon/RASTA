var upload = angular.module('upload', ['ngFileUpload']);

upload.controller('uploadCtrl', ['$scope', '$http', '$timeout', 'validateUserService', 'Upload', function ($scope, $http, $timeout, validateUserService, Upload) {
  validateUserService.validateUser().then(function (response) {
    $scope.validUser = response;
  });

  $scope.submit = function () {
    if ($scope.fileUp) {
      $scope.uploadAttempt = true;
      $scope.statusStyle = {
        "font-style": "italic",
        "font-weight": "bold"
      };
      Upload.upload({
        url: '/api/upload',
        data: {file: $scope.fileUp}
      }).then(function (resp) {
        $scope.statusColor = "text-success";
        $scope.uploadStatus = "Upload successfully processed.";
        // if (resp.data.error_code === 0) { //validate success
        //   alert('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data);
        // } else {
        //   alert('an error occured: ' + JSON.stringify(resp.data.err_desc));
        // }
        $timeout(function () {
          $scope.uploadAttempt = false;
        }, 3000);
      }, function (resp) { //catch error
        console.log('Error status: ' + resp.status);
      }, function (evt) {
        var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
        console.log(progressPercentage);
        document.getElementById("uploadProgressBar").style.width = progressPercentage + '%';
      });
    }
  };

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

}]);