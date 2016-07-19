var upload = angular.module('upload', ['ngFileUpload', 'ngMaterial']);

//service for prefixes
upload.service('prefixService', function ($http) {
  this.getPrefixes = function () {
    return $http.get('/api/prefix/retrieve').then(function (response) {
      return response.data;
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

  $scope.processPrefixSelection = function (prefix) {
    if (prefix) {
      document.getElementById('uploadBtn').disabled = false;
    }
  }


  var self = this;
  self.simulateQuery = false;
  self.isDisabled = false;
  // list of states to be displayed
  self.states = loadStates();
  self.querySearch = querySearch;
  self.selectedItemChange = selectedItemChange;
  self.searchTextChange = searchTextChange;
  self.newState = newState;
  function newState(state) {
    alert("This functionality is yet to be implemented!");
  }

  function querySearch(query) {
    var results = query ? self.states.filter(createFilterFor(query)) : self.states, deferred;
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
    $log.info('Text changed to ' + text);
  }

  function selectedItemChange(item) {
    $log.info('Item changed to ' + JSON.stringify(item));
  }

  //build list of states as map of key-value pairs
  function loadStates() {
    var urls = ['http://pub.lmmp.nasa.gov', 'https://ops.lmmp.nasa.gov'];

    //return an array of objects
    return urls.map(function (url) {
      return {
        value: url.toLowerCase(),
        display: url
      };
    });
  }

  // function loadPrefixes() {
  //   return new Promise(function(resolve) {
  //     prefixService.getPrefixes().then(function(urls) {
  //       console.log(urls);
  //       resolve(urls);
  //     });
  //   });
  // }
  //
  // loadPrefixes().then(function(response) {
  //   console.log(response);
  // })

  prefixService.getPrefixes().then(function(urls) {
    console.log(urls);
  })

  //filter function for search query
  function createFilterFor(query) {
    var lowercaseQuery = angular.lowercase(query);
    return function filterFn(state) {
      return (state.value.indexOf(lowercaseQuery) === 0);
    };
  }

  $scope.deletePrefix = function (item) {
    alert(JSON.stringify(item));
  }
}]);