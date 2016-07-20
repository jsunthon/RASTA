var upload = angular.module('upload', ['ngFileUpload', 'ngMaterial']);

upload.service('prefixService', function ($http) {
  this.getPrefixes = function () {
    return $http.get('/api/prefix/retrieve').then(function (response) {
      return response.data;
    });
  }

  this.deletePrefix = function (prefix) {
    var prefix = {prefix: prefix};
    return $http.post('/api/prefix/delete', prefix, {headers: {'Content-Type': 'application/json'}}).then(function (statusCode) {
      return statusCode;
    });
  }

  this.determineExt = function (fileUp) {
    var fileExt = fileUp.name.split('.')[1];
    var uploadBtn = document.getElementById('uploadBtn');
    var disabledBtn = uploadBtn.disabled;
    var fileProps = {fileExt: fileExt}
    if (fileExt === 'log') {
      fileProps.logType = true;
      if (!disabledBtn) {
        uploadBtn.disabled = true;
      }
    } else if (fileExt === 'json') {
      fileProps.logType = false;
      if (disabledBtn === true) {
        uploadBtn.disabled = false;
      }
    }
    return fileProps;
  }
});

upload.controller('uploadCtrl', ['$scope', '$http', '$timeout', 'validateUserService', 'Upload', '$q', '$log', 'prefixService', function ($scope, $http, $timeout, validateUserService, Upload, $q, $log, prefixService) {

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

      var uploadObj = {
        url: '/api/upload',
        data: {file: $scope.fileUp}
      };

      if ($scope.fileProps.fileExt === 'log') {
        console.log($scope.prefixSelected);
        uploadObj.data.prefix = $scope.prefixSelected;
      }

      Upload.upload(uploadObj).then(function (resp) {
        $scope.jsonUploaded = true;
        $scope.processingUpload = false;
        $scope.jsonRsp = resp.data;
        prefixService.getPrefixes().then(function (prefixes) {
          $scope.prefixes = prefixes.map(function (prefix) {
            return prefix.prefix;
          });
        });
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
      $scope.fileProps = prefixService.determineExt($scope.fileUp);
      $scope.logType = $scope.fileProps.logType;
    }
  }

  $scope.deletePrefix = function (prefix) {
    if (prefix) {
      prefixService.deletePrefix(prefix).then(function () {
        prefixService.getPrefixes().then(function (prefixes) {
          $scope.prefixes = prefixes.map(function (prefix) {
            return prefix.prefix;
          });
        });
      });
    }
  }

  var self = this;
  self.simulateQuery = false;
  self.isDisabled = false;
  prefixService.getPrefixes().then(function (prefixes) {
    $scope.prefixes = prefixes.map(function (prefix) {
      return prefix.prefix;
    });
  });

  self.querySearch = querySearch;
  self.searchTextChange = searchTextChange;
  self.selectedItemChange = selectedItemChange;

  function querySearch(query) {
    return query ? $scope.prefixes.filter(createFilterFor(query)) : $scope.prefixes;
  }

  function searchTextChange(text) {
    var uploadBtn = document.getElementById('uploadBtn');
    if (text !== '') {
      if (uploadBtn.disabled) {
        uploadBtn.disabled = false;
      }
      $scope.prefixSelected = text;
    }
    else {
      if (!uploadBtn.disabled) {
        uploadBtn.disabled = true;
      }
    }
  }

  function selectedItemChange(item) {
    $scope.prefixSelected = item;
    var uploadBtn = document.getElementById('uploadBtn');
    if (uploadBtn.disabled) {
      uploadBtn.disabled = false;
    }
  }

  function createFilterFor(query) {
    var lowercaseQuery = angular.lowercase(query);
    return function filterFn(prefix) {
      if (prefix) {
        return (prefix.indexOf(lowercaseQuery) === 0);
      }
    };
  }
}]);