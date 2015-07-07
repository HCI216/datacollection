angular.module('sailng.header', [])
    .controller('HeaderCtrl', function HeaderController($scope, $state, config) {
        $scope.currentUser = config.currentUser;

        var navItems = [];

        if (!$scope.currentUser) {
          navItems.push({title: '注册', translationKey: 'navigation:register', url: '/register', cssClass: ''});
          navItems.push({title: '登陆', translationKey: 'navigation:login', url: '/login', cssClass: ''});
        } else {
          navItems.push({title: '个人信息', translationKey: 'navigation:info', url: '/info', cssClass: ''});
          navItems.push({title: '账号设置', translationKey: 'navigation:setting', url: '/setting', cssClass: ''});
        }

        $scope.navItems = navItems;

        $scope.isActive = function(item) {
            if ($state.includes(item.title.toLowerCase())) {
                return true;
            }
            return false;
        };

    });
