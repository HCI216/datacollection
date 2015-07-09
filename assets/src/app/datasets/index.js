angular.module('sailng.datasets', ['angularFileUpload'])
    .config(function config($stateProvider) {
        $stateProvider.state('datasets', {
            url: '/datasets',
            views: {
                "main": {
                    controller: 'DatasetsCtrl',
                    templateUrl: 'datasets/index.tpl.html'
                }
            }
        });
    })
    .controller('DatasetsCtrl', function DatasetsController($scope, titleService, $http, $window, $modal, $log, FileUploader, config, $rootScope) {
        $scope.currentUser = config.currentUser;
        titleService.setTitle('DataSets');
        $scope.search = "";
        ///分页---start
        $scope.paginator = {
            page: 1,
            next_page: 1,
            pre_page: 1,
            first_page: 1,
            last_page: 1,
            limit: 10,
            total_pages: 1,
            total_items: 10
        };
      $scope.download = function(dataset) {
        $http.post('api/datasetsdownload', {
          tablename:dataset.tablename,
          name:dataset.name
        }).success(function(data, status, headers, config) {
          $log.info('Ok,download dataset');
          $rootScope.$emit('notification', '下载数据集成功');
        }).error(function(data) {
          $rootScope.$emit('notification', '下载数据集失败');
          alert("failed:" + JSON.stringify({
            data: data
          }));
        });
      };
      $scope.limits = [10, 20, 30, 50, 100];
      $scope.datasets = {
        data: []
      };
      $scope.query="";
      $scope.search = function(item){
        if(item.name.indexOf($scope.query)!=-1
           || item.owner.username.indexOf($scope.query)!=-1
           || item.description.indexOf($scope.query)!=-1
          )
        {
          return true;
        }
        return false;
      },
        $scope.datasetToBeRemove = {};
        $scope.removedataset = function(dataset) {
            $scope.datasetToBeRemove = dataset;
        };
      $scope.confirmRemoveDataset = function() {
            $http.post('api/destroydataset', {
                id: $scope.datasetToBeRemove.id
            }).success(function(data, status, headers, config) {
                $log.info('Ok,remove dataset');
                $rootScope.$emit('notification', '删除数据集成功');
                $scope.datasets.data.splice($scope.datasets.data.indexOf($scope.datasetToBeRemove), 1);
                console.log(angular.fromJson(data));
            }).error(function(data) {
                $rootScope.$emit('notification', '删除数据集失败');
                alert("failed:" + JSON.stringify({
                    data: data
                }));
            });
        };



        $scope.pageChanged = function(page) {
            $scope.paginator.page = page;
            $http.get('api/datasetscount').success(function(data, status, headers, config) {
                $scope.paginator.total_items = data.count;

                $scope.paginator.total_pages = Math.ceil($scope.paginator.total_items / $scope.paginator.limit);
                $scope.paginator.last_page = $scope.paginator.total_pages;

                if ($scope.paginator.page + 1 <= $scope.paginator.total_pages) {
                    $scope.paginator.next_page = $scope.paginator.page + 1;
                }
                if ($scope.paginator.page - 1 > 0) {
                    $scope.paginator.pre_page = $scope.paginator.page - 1;
                }

                if ($scope.paginator.total_items != 0) {
                    $http.get('api/datasets', {
                        params: {
                            page: $scope.paginator.page,
                            limit: $scope.paginator.limit
                        }
                    }).success(function(data, status, headers, config) {
                        console.log(angular.fromJson(data));
                        $scope.datasets.data = data;
                    }).error(function(data) {
                        alert("failed:" + JSON.stringify({
                            data: data
                        }));
                    });
                }
            }).error(function(data) {
                alert("failed:" + JSON.stringify({
                    data: data
                }));
            });
        };

        $scope.nextPage = function() {
            $scope.pageChanged($scope.paginator.next_page);
        };

        $scope.prePage = function() {
            $scope.pageChanged($scope.paginator.pre_page);
        };

        $scope.firstPage = function() {
            $scope.pageChanged($scope.paginator.first_page);
        };

        $scope.lastPage = function() {
            $scope.pageChanged($scope.paginator.last_page);
        };

        $scope.pageChanged(1);
        ///分页---end


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


        ///新建数据集  start
      $scope.newFile = function() {

            var modalInstance = $modal.open({
                templateUrl: 'datasets/newdataset.tpl.html',
                controller: 'newInstanceCtrl',
                resolve: {
                    datasetsInfo: function() {
                        return {};
                    }
                }
            });

            modalInstance.result.then(function(dataset_info) {
                console.log("dataset_Info : " + angular.toJson(dataset_info));
                $http.post('/api/newdataset', {
                    name: dataset_info.datasetName,
                    filename: 'blank.csv',
                    path: '/tmp/sailng-upload/',
                    tablename: 'blank',
                  ispublic: dataset_info.ispublic.value,
                  description: dataset_info.datasetDescription
                }).success(function(data, status, headers, config) {
                  alert(data+ "====");
                  $log.info('success create new dataset');
                  $rootScope.$emit('notification', '新建数据集成功');
                }).error(function(data) {
                  $rootScope.$emit('notification', '新建数据集失败');
                  alert("failed:" + JSON.stringify({
                    data: data
                  }));
                });
            }, function() {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };
        ///空数据集---end
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
    })


    .controller('newInstanceCtrl', function($scope, $modalInstance, FileUploader, datasetsInfo) {
        // -----------------------------------  input -------------------------
        $scope.datasetsInfo = datasetsInfo;
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

        //--------------------------------- result callback  ------------------------------

        $scope.ok = function() {
            console.log("result:", $scope.datasetsInfo);
            $modalInstance.close($scope.datasetsInfo);
        };

        $scope.cancel = function() {
            $modalInstance.dismiss('cancel');
        };
    });
