angular.module('sailng.reports', [])

.config(function config($stateProvider) {
    $stateProvider.state('reports', {
        url: '/reports',
        views: {
            "main": {
                controller: 'ReportsCtrl',
                templateUrl: 'reports/index.tpl.html'
            }
        }
    });
})

.controller('ReportsCtrl', function ReportsController($scope, $rootScope, titleService, $window, $http, $modal, $log, config) {
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
  titleService.setTitle('Reports');
  $scope.currentUser = config.currentUser;
  ///获取报告集信息---start
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
        $scope.reports = {
            data: []
        };
        $scope.reportToBeRemove = {};
        $scope.removereport = function(report) {
            $scope.reportToBeRemove = report;
        };
        $scope.confirmRemoveReport = function() {
            $http.post('api/destroyreport', {
                id: $scope.reportToBeRemove.id
            }).success(function(data, status, headers, config) {
                $log.info('Ok,remove report');
                $rootScope.$emit('notification', '删除报告成功');
                $scope.reports.data.splice($scope.reports.data.indexOf($scope.reportToBeRemove), 1);
                console.log(angular.fromJson(data));
            }).error(function(data) {
                $rootScope.$emit('notification', '删除报告失败');
                alert("failed:" + JSON.stringify({
                    data: data
                }));
            });
        };

        $scope.pageChanged = function(page) {
            $scope.paginator.page = page;
            $http.get('api/reportscount').success(function(data, status, headers, config) {
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
                    $http.get('api/reports', {
                        params: {
                            page: $scope.paginator.page,
                            limit: $scope.paginator.limit
                        }
                    }).success(function(data, status, headers, config) {
                        console.log(angular.fromJson(data));
                        $scope.reports.data = data;
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



        ///获取报告集信息---end
        $scope.sendReport = function(reportInfo) {
            var modalInstance = $modal.open({
                templateUrl: 'reports/mailer.tpl.html',
                controller: 'mailerInstanceCtrl',
                size: "lg",
                resolve: {
                    reportInfo: function() {
                        return {
                            reportInfo: reportInfo
                        };
                    }
                }
            });
            modalInstance.result.then(function(mailOpt) {
                $http.post('api/sendreport', {
                    mailOpt: mailOpt
                }).success(function(data, status, headers, config) {
                    $log.info('Ok,modal');
                    $rootScope.$emit('notification', '发送报告成功');
                    console.log(angular.fromJson(data));
                }).error(function(data) {
                    $rootScope.$emit('notification', '发送报告失败');
                    alert("failed:" + JSON.stringify({
                        data: data
                    }));
                });
            }, function() {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };
    })
    .controller('mailerInstanceCtrl', function($scope, $log, $modalInstance, $http, reportInfo, config) {
        // -----------------------------------  input -------------------------
        $scope.mailOpt = {
            path: reportInfo.reportInfo.path,
            receiver: config.currentUser.email,
            subject: 'Report From CoaSars By  ' + config.currentUser.username,
            text: '在CoaSars上生成的报告'
        };
        $scope.sendreport = function() {
            $log.info($scope.mailOpt);
            $modalInstance.close($scope.mailOpt);
        };

        //--------------------------------- result callback  ------------------------------

        $scope.cancel = function() {
            $modalInstance.dismiss('cancel');
        };
    });
