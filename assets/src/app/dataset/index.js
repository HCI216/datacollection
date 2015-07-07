angular.module('sailng.dataset', ['angularFileUpload'])
    .config(function config($stateProvider) {
        $stateProvider.state('dataset', {
            url: '/dataset/:datasetId',
            views: {
                "main": {
                    controller: 'DatasetCtrl',
                    templateUrl: 'dataset/index.tpl.html'
                }
            }
        });
    })
  .controller('DatasetCtrl', function DatasetController($scope, titleService, $http, $window, $modal, $log, FileUploader, $stateParams,$rootScope) {
        console.log("enter dataset");
        titleService.setTitle('Dataset');
        $scope.datasetId = $stateParams.datasetId;
        $scope.dataset = {};
        $http.get("api/datasets/" + $scope.datasetId).success(function(data, status, headers, config) {
            console.log(angular.toJson(data).info);
            $scope.dataset = (data.info);
            $scope.datas = angular.fromJson(data.data);
            $scope.keys = [], log = [];
            console.log(data);
            angular.forEach(data.data[0], function iterator(value, key) {
                $scope.keys.push(key);
            }, log);
        }).error(function(data) {
        }) ;
      $scope.editCell = function(row, col) {
            console.log(row);
            console.log($scope.datas[row][$scope.keys[col]]);
            var modalInstance = $modal.open({
                templateUrl: 'dataset/editcell.tpl.html',
                controller: 'EditCellCtrl',
                size: "sm",
                resolve: {
                    cellData: function() {
                        return {
                          coasarsid:$scope.datas[row].coasarsid,
                            colname: $scope.keys[col],
                            row: row,
                            data: $scope.datas[row][$scope.keys[col]]
                        };
                    }
                }
            });
            modalInstance.result.then(function(cellData) {
                console.log(" : " + angular.toJson(cellData));
                $http.post('/api/dataset/celledit', {
                  row:cellData.row,
                  coasarsid:cellData.coasarsid,
                  colname: cellData.colname,
                  tablename: $scope.dataset.tablename,
                  data: cellData.data
                }).success(function(data, status, headers, config) {
                    if (data.status != "error") {
                        $scope.datas[data.celldata.row][data.celldata.colname] = data.celldata.data;
                        $log.info('dataCell Edit Success!');
                    }
                }).error(function(data) {
                    alert("failed:" + JSON.stringify({
                        data: data
                    }));
                });
            }, function() {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };

    $scope.newcolumn = function() {
              var modalInstance = $modal.open({
                templateUrl: 'dataset/newcolumn.tpl.html',
                controller: 'NewColumnCtrl',
                size: "sm",
                resolve: {}
            });
            modalInstance.result.then(function(columnInfo) {
              $http.post('/api/dataset/newcolumn', {
                colname:columnInfo.name,
                datatype:columnInfo.datatype,
                tablename:$scope.dataset.tablename
                }).success(function(data, status, headers, config) {
                    if (data.status != "error") {
                      $rootScope.$emit('notification', '添加列成功');
                      $log.info('Add new column Success!');
                    }else{
                      $rootScope.$emit('notification', '添加列失败');
                    }
                }).error(function(data) {
                    alert("failed:" + JSON.stringify({
                        data: data
                    }));
                });
            }, function() {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };
    $scope.deletecolumn = function() {
      var modalInstance = $modal.open({
        templateUrl: 'dataset/deletecolumn.tpl.html',
        controller: 'DeleteColumnCtrl',
                size: "sm",
                resolve: {}
            });
            modalInstance.result.then(function(columnInfo) {
              $http.post('/api/dataset/deletecolumn', {
                colname:columnInfo.name,
                tablename:$scope.dataset.tablename
                }).success(function(data, status, headers, config) {
                    if (data.status != "error") {
                      $rootScope.$emit('notification', '删除列成功');
                      $log.info('Add new column Success!');
                    }else{
                      $rootScope.$emit('notification', '删除列失败');
                    }
                }).error(function(data) {
                    alert("failed:" + JSON.stringify({
                        data: data
                    }));
                });
            }, function() {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };
    $scope.newrow = function() {
              var modalInstance = $modal.open({
                templateUrl: 'dataset/newrow.tpl.html',
                controller: 'NewRowCtrl',
                size: "sm",
                resolve: {}
            });
            modalInstance.result.then(function(rowInfo) {
              $http.post('/api/dataset/newrow', {
                rowvalues:rowInfo.name,
                tablename:$scope.dataset.tablename
                }).success(function(data, status, headers, config) {
                    if (data.status != "error") {
                      $rootScope.$emit('notification', '添加行成功');
                      $log.info('Add new row Success!');
                    }else{
                      $rootScope.$emit('notification', '添加行失败');
                    }
                }).error(function(data) {
                    alert("failed:" + JSON.stringify({
                        data: data
                    }));
                });
            }, function() {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };
    $scope.deleterow = function() {
      var modalInstance = $modal.open({
        templateUrl: 'dataset/deleterow.tpl.html',
        controller: 'DeleteRowCtrl',
                size: "sm",
                resolve: {}
            });
            modalInstance.result.then(function(rowInfo) {
              $http.post('/api/dataset/deleterow', {
                coasarsid:rowInfo.name,
                tablename:$scope.dataset.tablename
                }).success(function(data, status, headers, config) {
                    if (data.status != "error") {
                      $rootScope.$emit('notification', '删除列成功');
                      $log.info('Add new row Success!');
                    }else{
                      $rootScope.$emit('notification', '删除列失败');
                    }
                }).error(function(data) {
                    alert("failed:" + JSON.stringify({
                        data: data
                    }));
                });
            }, function() {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };
  })

  .controller('EditCellCtrl', function($scope, $modalInstance, cellData) {
        $scope.cellData = cellData;
        $scope.ok = function() {
            console.log("result:", $scope.cellData);
            $modalInstance.close($scope.cellData);
        };
        $scope.cancel = function() {
            $modalInstance.dismiss('cancel');
        };
    })
    .controller('NewColumnCtrl', function($scope, $modalInstance) {
      $scope.columnInfo={name:'',datatype:'character'};
      $scope.datatypes=[{label:'字符',value:'character'},{label:'数值',value:'numeric'},{label:'日期',value:'date'}];
      $scope.ok = function() {
        $scope.columnInfo.datatype=$scope.columnInfo.datatype.value;
          console.log("result:", $scope.columnInfo);
          $modalInstance.close($scope.columnInfo);
        };
        $scope.cancel = function() {
            $modalInstance.dismiss('cancel');
        };
    })
  .controller('DeleteColumnCtrl', function($scope, $modalInstance) {
        $scope.columnInfo={};
        $scope.ok = function() {
          console.log("result:", $scope.columnInfo);
          $modalInstance.close($scope.columnInfo);
        };
        $scope.cancel = function() {
            $modalInstance.dismiss('cancel');
        };
    })
    .controller('NewRowCtrl', function($scope, $modalInstance) {
        $scope.rowInfo={};
        $scope.ok = function() {
          $scope.rowInfo.name='('+$scope.rowInfo.name+')';
          console.log("result:", $scope.rowInfo);
          $modalInstance.close($scope.rowInfo);
        };
        $scope.cancel = function() {
            $modalInstance.dismiss('cancel');
        };
    })
  .controller('DeleteRowCtrl', function($scope, $modalInstance) {
        $scope.rowInfo={};
        $scope.ok = function() {
          console.log("result:", $scope.rowInfo);
          $modalInstance.close($scope.rowInfo);
        };
        $scope.cancel = function() {
            $modalInstance.dismiss('cancel');
        };
    });
