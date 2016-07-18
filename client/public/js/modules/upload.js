var upload = angular.module('upload', ['ngFileUpload']);

upload.controller('uploadCtrl', ['$scope', '$http', '$timeout', 'validateUserService', 'Upload', function ($scope, $http, $timeout, validateUserService, Upload) {
  validateUserService.validateUser().then(function (response) {
    $scope.validUser = response;
  });

  $scope.submit = function () {
    $scope.jsonUploaded = false;
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
        $scope.jsonUploaded = true;
        $scope.processingUpload = false;
        $scope.jsonRsp = resp.data;
      }, function (resp) {
        console.log('Error status: ' + resp.status);
      }, function (evt) {
        var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
        $scope.uploadingMsg = "Uploading to server: " + progressPercentage + " %";
        if (progressPercentage === 100) {
          $timeout(function() {
            $scope.uploadAttempt = false;
          }, 2500);
          $scope.processingUpload = true;
          $scope.statusMsg = "Processing uploaded configuration file...";
        }
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