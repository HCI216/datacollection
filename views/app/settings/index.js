angular.module('sailng.settings', [])

.config(function config($stateProvider) {
    $stateProvider.state('settings', {
        url: '/settings',
        views: {
            "main": {
                controller: 'SettingsCtrl',
                templateUrl: 'settings/index.tpl.html'
            }
        }
    });
})

.controller('SettingsCtrl', function SettingsController($scope, titleService, $window, config, $http, $rootScope, $log) {
    titleService.setTitle('Settings');
    $scope.currentUser = config.currentUser;
    $scope.editKey = '';
    $scope.password = '';
    $scope.npassword = '';
    $scope.viptype = $scope.currentUser.isViptype === 'true' ? '付费会员' : '免费会员';
    $scope.passwd = function() {
            if ($scope.password.length < 8 || $scope.npassword.length < 8)
                alert('密码太短');
            $http.post('auth/local/passwd', {
                identifier: $scope.currentUser.email,
                password: $scope.password,
                npassword: $scope.npassword
            }).success(function(data, status, headers, config) {
                $log.info('Ok,Change Password');
                $rootScope.$emit('notification', '修改密码成功');
                $scope.users.data.splice($scope.users.data.indexOf($scope.userToBeRemove), 1);
                console.log(angular.fromJson(data));
            }).error(function(data) {
                $rootScope.$emit('notification', '修改密码失败');
                alert("failed:" + JSON.stringify({
                    data: data
                }));
            });
        },
        $scope.editUser = function(key) {
            $scope.editKey = key;
        },
        $scope.saveUser = function(value) {
            $http.post('api/updateuser', {
                id: $scope.currentUser.id,
                key: $scope.editKey,
                value: value
            }).success(function(data, status, headers, config) {
                $log.info('Ok,Update user');
                $rootScope.$emit('notification', '更新个人信息成功');
                $scope.currentUser[$scope.editKey] = value;
                console.log(angular.fromJson(data));
            }).error(function(data) {
                $rootScope.$emit('notification', '更新个人信息失败');
                alert("failed:" + JSON.stringify({
                    data: data
                }));
            });
        },

        $scope.userToBeVip = {};

    $scope.usertovip = function(user) {
        $scope.userToBeVip = user;
    };
    $scope.confirmToVip = function() {
        $http.post('api/updateuser', {
            id: $scope.userToBeVip.id,
            key: 'isViptype',
            value: true
        }).success(function(data, status, headers, config) {
            $log.info('Ok, user improved to vip');
            $rootScope.$emit('notification', '提升用户为vip成功');
            $scope.users.data[$scope.users.data.indexOf($scope.userToBeVip)].isViptype = true;
            console.log(angular.fromJson(data));
        }).error(function(data) {
            $rootScope.$emit('notification', '提升用户为vip失败');
            alert("failed:" + JSON.stringify({
                data: data
            }));
        });
    };
  $scope.userToBeadmin = {};

    $scope.usertoadmin = function(user) {
        $scope.userToBeadmin = user;
    };
    $scope.confirmToadmin = function() {
        $http.post('api/updateuser', {
            id: $scope.userToBeadmin.id,
            key: 'isadmin',
            value: true
        }).success(function(data, status, headers, config) {
            $log.info('Ok, user improved to vip');
            $rootScope.$emit('notification', '提升用户为vip成功');
            $scope.users.data[$scope.users.data.indexOf($scope.userToBeadmin)].isadmin = 'true';
            console.log(angular.fromJson(data));
        }).error(function(data) {
            $rootScope.$emit('notification', '提升用户为vip失败');
            alert("failed:" + JSON.stringify({
                data: data
            }));
        });
    };

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
    $scope.users = {
        data: []
    };
    $scope.usercount = 0;
    $scope.vipusercount = 0;
    $scope.userToBeRemove = {};
    $scope.removeuser = function(user) {
        $scope.userToBeRemove = user;
    };
    $scope.confirmRemoveUser = function() {
        $http.post('api/destroyuser', {
            id: $scope.userToBeRemove.id
        }).success(function(data, status, headers, config) {
            $log.info('Ok,remove user');
            $rootScope.$emit('notification', '删除用户成功');
            $scope.users.data.splice($scope.users.data.indexOf($scope.userToBeRemove), 1);
            console.log(angular.fromJson(data));
        }).error(function(data) {
            $rootScope.$emit('notification', '删除用户失败');
            alert("failed:" + JSON.stringify({
                data: data
            }));
        });
    };

    $scope.pageChanged = function(page) {
        $scope.paginator.page = page;
        $http.get('api/userscount').success(function(data, status, headers, config) {
            $scope.paginator.total_items = data.count;
            $scope.usercount = data.count;
            $scope.vipusercount = data.vipcount;
            $scope.paginator.total_pages = Math.ceil($scope.paginator.total_items / $scope.paginator.limit);
            $scope.paginator.last_page = $scope.paginator.total_pages;

            if ($scope.paginator.page + 1 <= $scope.paginator.total_pages) {
                $scope.paginator.next_page = $scope.paginator.page + 1;
            }
            if ($scope.paginator.page - 1 > 0) {
                $scope.paginator.pre_page = $scope.paginator.page - 1;
            }


            if ($scope.paginator.total_items != 0) {
                $http.get('api/users', {
                    params: {
                        page: $scope.paginator.page,
                        limit: $scope.paginator.limit
                    }
                }).success(function(data, status, headers, config) {
                    console.log(angular.fromJson(data));
                    $scope.users.data = data;
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

});
