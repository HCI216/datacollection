angular.module('sailng.home', [])

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

.controller('HomeCtrl', function HomeController($scope, titleService, $window, $rootScope, config, $http, $log) {
    titleService.setTitle('Home');
    $scope.currentUser = config.currentUser;
    $scope.title = '';
    $scope.content = '';
    $scope.news = [];
    $scope.newsToBeRemove = {};
    $scope.removenews = function(news) {
        $scope.newsToBeRemove = news;
    };
    $scope.confirmRemoveNews = function() {
        $http.post('api/destroynews', {
            id: $scope.newsToBeRemove.id
        }).success(function(data, status, headers, config) {
            $log.info('Ok,remove news');
            $scope.news.splice($scope.news.indexOf($scope.newsToBeRemove), 1);
            console.log(angular.fromJson(data));
        }).error(function(data) {
            alert("failed:" + JSON.stringify({
                data: data
            }));
        });
    };
    $http.get('api/news', {})
        .success(function(data, status, headers, config) {
            console.log(angular.fromJson(data));
            $scope.news = angular.fromJson(data);
        })
        .error(function(data) {
            alert("failed:" + JSON.stringify({
                data: data
            }));
        });
    $scope.msg = function() {
        $http.post('api/addnews', {
            title: $scope.title,
            content: $scope.content
        }).success(function(data, status, headers, config) {
            $log.info('Ok,msg');
            $scope.news.unshift(data);
            $rootScope.$emit('notification', '添加系统通知成功');
            console.log(angular.fromJson(data));
        }).error(function(data) {
            alert("failed:" + JSON.stringify({
                data: data
            }));
        });
    };
    $http.get('api/templates', {
            params: {
                page: 1,
                limit: 5
            }
        })
        .success(function(data, status, headers, config) {
            console.log(angular.fromJson(data));
            $scope.templatelist = angular.fromJson(data);
        })
        .error(function(data) {
            alert("failed:" + JSON.stringify({
                data: data
            }));
        });
    $http.get('api/reports', {
            params: {
                page: 1,
                limit: 6
            }
        })
        .success(function(data, status, headers, config) {
            console.log(angular.fromJson(data));
            $scope.reportlist = angular.fromJson(data);
        })
        .error(function(data) {
            alert("failed:" + JSON.stringify({
                data: data
            }));
        });
    $http.get('api/datasets', {
            params: {
                page: 1,
                limit: 12
            }
        })
        .success(function(data, status, headers, config) {
            console.log(angular.fromJson(data));
            $scope.datasetlist = angular.fromJson(data);
        })
        .error(function(data) {
            alert("failed:" + JSON.stringify({
                data: data
            }));
        });
});
