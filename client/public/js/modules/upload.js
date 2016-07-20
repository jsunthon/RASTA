var upload = angular.module('upload', ['ngFileUpload', 'ngMaterial']);

//service for prefixes
upload.service('prefixService', function ($http) {
  this.getPrefixes = function () {
    return $http.get('/api/prefix/retrieve').then(function (response) {
      return response.data;
    });
  }

  this.deletePrefix = function (prefix) {
    return $http.post('/api/prefix/delete/' + prefix).then(function (statusCode) {
      return statusCode;
    });
  }
});

upload.controller('uploadCtrl', ['$scope', '$http', '$timeout', 'validateUserService', 'Upload', '$q', '$log', 'prefixService', function ($scope, $http, $timeout, validateUserService, Upload, $q, $log, prefixService) {

  $scope.logUrlPrefixes = [{url: 'http://pub.lmmp.nasa.gov'}, {url: 'https://ops.lmmp.nasa.gov'}];

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

      var ext = $scope.determineExt();

      if (ext === 'log') {
        console.log($scope.prefixSelected);
        uploadObj.data.prefix = $scope.prefixSelected;
      }

      Upload.upload(uploadObj).then(function (resp) {
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
    return fileExt;
  }

  $scope.processPrefixSelection = function (prefix) {
    if (prefix) {
      document.getElementById('uploadBtn').disabled = false;
    }
  }


  var self = this;
  self.simulateQuery = false;
  self.isDisabled = false;
  // list of states to be displayed
  prefixService.getPrefixes().then(function (prefixes) {
    $scope.prefixes = prefixes.map(function (prefix) {
      return prefix.prefix;
    });
  });
  self.querySearch = querySearch;
  self.selectedItemChange = selectedItemChange;
  self.searchTextChange = searchTextChange;

  function querySearch(query) {
    var results = query ? $scope.prefixes.filter(createFilterFor(query)) : $scope.prefixes, deferred;
    if (self.simulateQuery) {
      deferred = $q.defer();
      $timeout(function () {
        deferred.resolve(results);
      },
        Math.random() * 1000, false);
      return deferred.promise;
    } else {
      return results;
    }
  }

  function searchTextChange(text) {
    $scope.prefixSelected = text;
  }

  window.onload = function() {
    var prefixSearchBox = document.getElementById('prefixSearchBox');
    prefixSearchBox.addEventListener("mouseout", function(event) {
      var uploadBtn = document.getElementById('uploadBtn');
      if (uploadBtn.disabled) {
        uploadBtn.disabled = false;
      }
    });
  }

  function selectedItemChange(item) {
    $scope.prefixSelected = item;
    var uploadBtn = document.getElementById('uploadBtn');
    if (uploadBtn.disabled) {
      uploadBtn.disabled = false;
    }
    // $log.info('Item changed to ' + JSON.stringify(item));
  }

  //filter function for search query
  function createFilterFor(query) {
    var lowercaseQuery = angular.lowercase(query);
    return function filterFn(state) {
      if (state) {
        return (state.indexOf(lowercaseQuery) === 0);
      }
    };
  }

  $scope.deletePrefix = function (prefix) {
    prefixService.deletePrefix(prefix).then(function (statusCode) {
      console.log("Deletion: " + statusCode);
    });
  }
}]);