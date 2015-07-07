angular.module('sailng.header', [])
    .controller('HeaderCtrl', function HeaderController($scope, $state, config) {
        $scope.currentUser = config.currentUser;

        var navItems = [{
            title: '主页',
            translationKey: 'navigation:home',
            url: '/home',
            cssClass: ''
        }, {
            title: '数据集',
            translationKey: 'navigation:datasets',
            url: '/datasets',
            cssClass: ''
        }, {
            title: '智能统计分析模板',
            translationKey: 'navigation:templates',
            url: '/templates',
            cssClass: ''
        }, {
            title: '分析报告',
            translationKey: 'navigation:reports',
            url: '/reports',
            cssClass: ''
        }, {
            title: '个人信息',
            translationKey: 'navigation:settings',
            url: '/settings',
            cssClass: ''
        }];

        $scope.navItems = navItems;

        $scope.isActive = function(item) {
            if ($state.includes(item.title.toLowerCase())) {
                return true;
            }
            return false;
        };

    });
