angular.module('sailng.home', ['angularFileUpload'])

.config(function config($stateProvider) {
    $stateProvider.state('home', {
        url: '/home',
        views: {
            "main": {
                controller: 'HomeCtrl',
                templateUrl: 'home/index.tpl.html'
            }
        }
    });
})

.controller('HomeCtrl', function HomeController($scope, titleService, $window, $modal,$log, $rootScope, config, $http, $log) {
    titleService.setTitle('Home');
    $scope.currentUser = config.currentUser;

    ///上传数据集  start
    $scope.uploadmodal = function() {

      var modalInstance = $modal.open({
        templateUrl: 'datasets/upload.tpl.html',
        controller: 'UploadInstanceCtrl',
        resolve: {
          datasetsInfo: function() {
            return {};
          }
        }
      });

      modalInstance.result.then(function(dataset_info) {
        console.log("dataset_Info : " + angular.toJson(dataset_info));
        $http.post('/api/datasets/upload', {
          name: dataset_info.datasetName,
          filename: dataset_info.uploadedFiles[0][0].filename,
          path: dataset_info.uploadedFiles[0][0].fd,
          tablename: dataset_info.datasetName,
          ispublic: dataset_info.ispublic.value,
          description: dataset_info.datasetDescription
        }).success(function(data, status, headers, config) {
          window.location.href = '/datasets';
          $log.info('success upload dataset');
          $rootScope.$emit('notification', '上传数据集成功');
        }).error(function(data) {
          $rootScope.$emit('notification', '上传数据集失败');
          alert("failed:" + JSON.stringify({
            data: data
          }));
        });
      }, function() {
        $log.info('Modal dismissed at: ' + new Date());
      });
    };
    ///上传数据集---end
})

.controller('UploadInstanceCtrl', function($scope, $modalInstance, FileUploader, datasetsInfo) {
  // -----------------------------------  input -------------------------
  $scope.datasetsInfo = datasetsInfo;
  $scope.datasetsInfo.uploadedFiles = [];
  $scope.datasetsInfo.datasetName = "";
  $scope.datasetsInfo.ispublicOptions = [{
    label: '公开',
    value: true
  }, {
    label: '不公开',
    value: false
  }];
  $scope.datasetsInfo.ispublic = $scope.datasetsInfo.ispublicOptions[1];
  $scope.datasetsInfo.datasetDescription = "";

  // ----------------------------- upload  --------------------
  var uploader = $scope.uploader = new FileUploader({
    url: 'api/file/upload'
  });

  // FILTERS

  uploader.filters.push({
    name: 'customFilter',
    fn: function(item /*{File|FileLikeObject}*/ , options) {
      return this.queue.length < 10;
    }
  });

  // CALLBACKS

  uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/ , filter, options) {
    console.info('onWhenAddingFileFailed', item, filter, options);
  };
  uploader.onAfterAddingFile = function(fileItem) {
    fileItem.upload();
    console.info('onAfterAddingFile', fileItem);
  };
  uploader.onAfterAddingAll = function(addedFileItems) {
    console.info('onAfterAddingAll', addedFileItems);
  };
  uploader.onBeforeUploadItem = function(item) {
    console.info('onBeforeUploadItem', item);
  };
  uploader.onProgressItem = function(fileItem, progress) {
    console.info('onProgressItem', fileItem, progress);
  };
  uploader.onProgressAll = function(progress) {
    console.info('onProgressAll', progress);
  };
  uploader.onSuccessItem = function(fileItem, response, status, headers) {
    console.info('onSuccessItem', fileItem, response, status, headers);
  };
  uploader.onErrorItem = function(fileItem, response, status, headers) {
    console.info('onErrorItem', fileItem, response, status, headers);
  };
  uploader.onCancelItem = function(fileItem, response, status, headers) {
    console.info('onCancelItem', fileItem, response, status, headers);
  };
  uploader.onCompleteItem = function(fileItem, response, status, headers) {
    console.info('onCompleteItem', fileItem, response, status, headers);
    $scope.datasetsInfo.uploadedFiles.push(angular.fromJson(response.files));
  };
  uploader.onCompleteAll = function() {
    console.info('onCompleteAll');
  };

  console.info('uploader', uploader);

  //--------------------------------- result callback  ------------------------------

  $scope.ok = function() {
    console.log("result:", $scope.datasetsInfo);
    $modalInstance.close($scope.datasetsInfo);
  };

  $scope.cancel = function() {
    $modalInstance.dismiss('cancel');
  };
});

