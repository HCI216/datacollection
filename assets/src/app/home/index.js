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
});
