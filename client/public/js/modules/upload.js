var upload = angular.module('upload', ['ngFileUpload']);

upload.controller('uploadCtrl', ['$scope', '$http', '$timeout', 'validateUserService', 'Upload', function ($scope, $http, $timeout, validateUserService, Upload) {

  $scope.logUrlPrefixes = [{url: 'http://pub.lmmp.nasa.gov'},  {url: 'https://ops.lmmp.nasa.gov'}];

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
        data: {file: $scope.fileUp, ext: $scope.fileUp.name.split('.')[1], prefix: $scope.prefixSelected.url}
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
          $timeout(function () {
            $scope.uploadAttempt = false;
          }, 2500);
          $scope.processingUpload = true;
          $scope.statusMsg = "Processing uploaded configuration file...";
        }
        document.getElementById("uploadProgressBar").style.width = progressPercentage + '%';
      });
    }
  };

  $scope.determineExt = function () {
    if ($scope.fileUp) {
      var fileExt = $scope.fileUp.name.split('.')[1];
      var uploadBtn = document.getElementById('uploadBtn');
      var disabledBtn = uploadBtn.disabled;
      if (fileExt === 'log') {
        $scope.logType = true;
        if (!disabledBtn) {
          uploadBtn.disabled = true;
        }
      } else if (fileExt === 'json') {
        $scope.logType = false;
        if (disabledBtn === true) {
          uploadBtn.disabled = false;
        }
      }
    }
  }

  $scope.processPrefixSelection = function(prefix) {
    if (prefix) {
      document.getElementById('uploadBtn').disabled = false;
    }
  }
}]);