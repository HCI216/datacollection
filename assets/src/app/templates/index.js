angular.module('sailng.templates', ['angularFileUpload'])
    .config(function config($stateProvider) {
        $stateProvider.state('templates', {
            url: '/templates',
            views: {
                "main": {
                    controller: 'TemplatesCtrl',
                    templateUrl: 'templates/index.tpl.html'
                }
            }
        });
    })
    .controller('TemplatesCtrl', function TemplatesController($scope, $state, $http, titleService, $window, $modal, $log, FileUploader, config, $rootScope) {

      $scope.query="";
      $scope.search = function(item){
        if(item.name.indexOf($scope.query)!=-1
           || item.description.indexOf($scope.query)!=-1
          )
        {
          return true;
        }
        return false;
      },

      titleService.setTitle('Templates');

        $scope.currentUser = config.currentUser;

        ///获取算法模板集信息---start
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
        $scope.limits = [10, 20, 30, 50, 100];
        $scope.templates = {
            data: []
        };
        $scope.templateToBeRemove = {};
        $scope.removetemplate = function(template) {
            $scope.templateToBeRemove = template;
        };
        $scope.confirmRemoveTemplate = function() {
            $http.post('api/destroytemplate', {
                id: $scope.templateToBeRemove.id
            }).success(function(data, status, headers, config) {
                $log.info('Ok,remove template');
                $rootScope.$emit('notification', '删除模板成功');
                $scope.templates.data.splice($scope.templates.data.indexOf($scope.templateToBeRemove), 1);
                console.log(angular.fromJson(data));
            }).error(function(data) {
                $rootScope.$emit('notification', '删除模板失败');
                alert("failed:" + JSON.stringify({
                    data: data
                }));
            });
        };

        $scope.pageChanged = function(page) {
            $scope.paginator.page = page;
            $http.get('api/templatescount')
                .success(function(data, status, headers, config) {
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
                        $http.get('api/templates', {
                            params: {
                                page: $scope.paginator.page,
                                limit: $scope.paginator.limit
                            }
                        }).success(function(data, status, headers, config) {
                            console.log(angular.fromJson(data));
                            $scope.templates.data = angular.fromJson(data);
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

        ///获取算法模板集信息---end

        ///上传模板  start
        $scope.uploadmodal = function() {
            var modalInstance = $modal.open({
                templateUrl: 'templates/upload.tpl.html',
                controller: 'templateUploadInstanceCtrl',
                size: "lg",
                resolve: {
                    templates: function() {
                        return {
                            catalogs: $scope.catalogs
                        };
                    }
                }
            });
            modalInstance.result.then(function(template_info) {
                console.log("template_ : " + angular.toJson(template_info.catalog));
                $http.post('/api/templates', {
                    name: template_info.name,
                    path: template_info.files[0][0].fd,
                    ispublic: template_info.ispublic,
                    callstring: template_info.callstring,
                    description: template_info.templateDescription,
                    catalog: template_info.catalog
                }).success(function(data, status, headers, config) {
                    $log.info('Success upload template');
                    $rootScope.$emit('notification', '上传模板成功');
                }).error(function(data) {
                    $rootScope.$emit('notification', '上传模板失败');
                    alert("failed:" + JSON.stringify({
                        data: data
                    }));
                });
            }, function() {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };
        ///上传模板---end
        ///模板算法调用  start
        $scope.templatemodal = function(templateInfo) {
            var modalInstance = $modal.open({
                templateUrl: 'templates/templatemodal.tpl.html',
                controller: 'templateCallInstanceCtrl',
                size: "lg",
                resolve: {
                    template: function() {
                        return {
                            templateInfo: templateInfo
                        };
                    }
                }
            });
            modalInstance.result.then(function(callParams) {
                console.log("modal Params : " + angular.toJson(callParams));
                $http.post('/api/reports', callParams).success(function(data, status, headers, config) {
                    $log.info('success Execute Template');
                    $rootScope.$emit('notification', '模板执行成功');
                    $state.go(callParams.output + 's');
                }).error(function(data) {
                    $rootScope.$emit('notification', '模板执行成功');
                    alert("failed:" + JSON.stringify({
                        data: data
                    }));
                });
            }, function() {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };
        //模板算法调用---end
        $http.get('api/catalog').success(function(data, status, headers, config) {
            $scope.catalogs = data;
        }).error(function(data) {
            alert("failed:" + JSON.stringify({
                data: data
            }));
        });

        //编辑目录--start
        $scope.editCatalog = function(id, name) {
            var modalInstance = $modal.open({
                templateUrl: 'templates/editcatalog.tpl.html',
                controller: 'editCatalogCtrl',
                size: "lg",
                resolve: {
                    opt: function() {
                        return {
                            id: id,
                            name: name
                        };
                    }
                }
            });

            modalInstance.result.then(function(opt) {
                console.log("opt : " + angular.toJson(opt));
            }, function() {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };
        ///编辑目录---end
    })

.controller('editCatalogCtrl', function($scope, $rootScope, $log, $http, $modalInstance, opt) {
        $scope.actions = [{
            label: '新建',
            api: 'create'
        }, {
            label: '删除',
            api: 'remove'
        }, {
            label: '重命名',
            api: 'rename'
        }];
        $scope.select = $scope.actions[0];
        $scope.opt = opt;
        $scope.opt.nName = '';
        $scope.ok = function(action) {
            $http.post('api/catalog/' + action, $scope.opt)
                .success(function(data, status, headers, config) {
                    $log.info(action + ' success ');
                    $rootScope.$emit('notification', action + '目录成功');
                }).error(function(data) {
                    $rootScope.$emit('notification', action + '目录失败');
                    alert("failed:" + JSON.stringify({
                        data: data
                    }));
                });
            $modalInstance.close($scope.opt);
        };
        $scope.cancel = function() {
            $modalInstance.dismiss('cancel');
        };
    })
    .controller('templateCallInstanceCtrl', function($scope, $log, $modalInstance, $http, template) {
        // -----------------------------------  input -------------------------
        $scope.templateInfo = template.templateInfo;
        $scope.callParams = {
            reportInfo: {
                description: '',
                ispublicOptions: [true, false],
                ispublic: false
            },
            dataset: {},
            paramFilePath: $scope.templateInfo.path,
            callstring: $scope.templateInfo.callstring,
            userParams: {}
        };
        $scope.currentdataset = '';
        $http.get('api/datasets', {
            params: {
                page: 1,
                limit: 10000
            }
        }).success(function(data, status, headers, config) {
            $log.info(data);
            $scope.datasets = angular.fromJson(data);
        }).error(function(data) {
            alert("failed:" + JSON.stringify({
                data: data
            }));
        });

        $http.get('api/templateparams', {
            params: {
                id: $scope.templateInfo.id
            }
        }).success(function(data, status, headers, config) {
            console.log(angular.fromJson(data));
            $scope.templateParams = angular.fromJson(data);
            angular.forEach($scope.templateParams.userParams, function(paramItem) {
                $scope.callParams.userParams[paramItem.name] = paramItem.value;
            });
            $scope.callParams.output = $scope.templateParams.output;
        }).error(function(data) {
            alert("failed:" + JSON.stringify({
                data: data
            }));
        });

        $scope.ondatasetchange = function(dataset, table) {
            $scope.callParams.userParams[table] = dataset.tablename;
            $scope.callParams.dataset = dataset;
            $http.get("api/datasets/" + dataset.id)
                .success(function(data, status, headers, config) {
                    $scope.datas = angular.fromJson(data.data);
                    $scope.columns = [], log = [];
                    angular.forEach(data.data[0], function iterator(value, key) {
                        $scope.columns.push(key);
                    }, log);
                }).error(function(data) {
                    console.log('error');
                });
        };
        $scope.runtemplate = function() {
            $log.info($scope.callParams);
            angular.forEach($scope.templateParams.userParams, function iterator(item) {
                if (item.type === 'multicol') {
                    var start = "";
                    var mid = $scope.callParams.userParams[item.name].join(",");
                    var end = "";
                    $scope.callParams.userParams[item.name] = start + mid + end;
                }
            });
            $modalInstance.close($scope.callParams);
        };
        $scope.add = function(array, index) {
            array.splice(index, 0, array[index]);
        };
        $scope.delete = function(array, index) {
            if (array.length > 1) array.splice(index, 1);
        };
        //--------------------------------- result callback  ------------------------------
        $scope.cancel = function() {
            $modalInstance.dismiss('cancel');
        };
    })
    .controller('templateUploadInstanceCtrl', function($scope, $modalInstance, FileUploader, templates) {
        // -----------------------------------  input -------------------------
        $scope.templates = templates;

        $scope.templates.files = [];
        $scope.templates.name = "";
        $scope.templates.callstring = "";
        $scope.templates.ispublic = false;
        $scope.templates.Description = "";

        $scope.catalogs = templates.catalogs;
        $scope.catalog = {};
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
            $scope.templates.files.push(angular.fromJson(response.files));
        };
        uploader.onCompleteAll = function() {
            console.info('onCompleteAll');
        };

        console.info('uploader', uploader);

        //--------------------------------- result callback  ------------------------------

        $scope.ok = function(catalogId) {
            $scope.templates.catalog = catalogId;
            $modalInstance.close($scope.templates);
            console.info("result:", catalogId);
        };

        $scope.cancel = function() {
            $modalInstance.dismiss('cancel');
        };
    });
