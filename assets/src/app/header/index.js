angular.module('sailng.header', [])

.controller('HeaderCtrl', function HeaderController($scope, $state, config, $modal, $log, $http,$rootScope) {
        $scope.currentUser = config.currentUser;

        var navItems = [];

        if (!$scope.currentUser) {
          navItems.push({title: '注册', translationKey: 'navigation:register', url: '/register', cssClass: '', event: ''});
          navItems.push({title: '登陆', translationKey: 'navigation:login', url: 'javascript:void(0);', cssClass: '', event: 'login();'});
        } else {
          navItems.push({title: '个人信息', translationKey: 'navigation:info', url: '/info', cssClass: '', event: ''});
          navItems.push({title: '账号设置', translationKey: 'navigation:setting', url: '/setting', cssClass: '', event: ''});
        }

        $scope.navItems = navItems;

        $scope.isActive = function(item) {
            if ($state.includes(item.title.toLowerCase())) {
                return true;
            }
            return false;
        };



    $scope.login = function() {

      var modalInstance = $modal.open({
        templateUrl: 'header/login.tpl.html',
        controller: 'loginCtrl',
        resolve: {
          user: function() {
            return {};
          }
        }
      });

      modalInstance.result.then(function(user) {
        console.log("login_Info : " + angular.toJson(user));
        $http.post('/auth/local', {
          identifier: user.identifier,
          password: user.password
        }).success(function(data, status, headers, config) {
          $log.info('success login' + data);
          $rootScope.$emit('notification', '登陆成功');
        }).error(function(data) {
          $rootScope.$emit('notification', '登陆失败');
          alert("failed:" + JSON.stringify({
            data: data
          }));
        });
      }, function() {
        $log.info('Modal dismissed at: ' + new Date());
      });
    };

    $scope.register = function() {

      var modalInstance = $modal.open({
        templateUrl: 'header/register.tpl.html',
        controller: 'registerCtrl',
        resolve: {
          user: function() {
            return {};
          }
        }
      });
      modalInstance.result.then(function(user_info) {
        console.log("register_Info : " + angular.toJson(user_info));
        var emails = new Array();
        emails.push(user_info.email);
        console.log(user_info.email + '===' + user_info.password + '====' +user_info.name);
        $http.post('/auth/local/register', {
          username: user_info.name,
          email: user_info.email,
          password: user_info.password,
          first_name: 'default_name'
        }).success(function(data, status, headers, config) {
          $log.info('success create new user' + data);
          $rootScope.$emit('notification', '注册成功');
        }).error(function(data) {
          $rootScope.$emit('notification', '注册失败');
          alert("failed:" + JSON.stringify({
            data: data
          }));
        });
      }, function() {
        $log.info('Modal dismissed at: ' + new Date());
      });
    };
  })

.controller('loginCtrl', function($scope, $modalInstance, user) {
    $scope.user = user;
    $scope.user.identifier = "";
    $scope.user.password = "";

  $scope.ok = function() {
    console.log("result:", $scope.user);
    $modalInstance.close($scope.user);
  };

  $scope.cancel = function() {
    $modalInstance.dismiss('cancel');
  };
})

.controller('registerCtrl', function($scope, $modalInstance, user) {
  // -----------------------------------  input -------------------------
  $scope.user = user;
  $scope.user.name = "";
  $scope.user.email = "";
  $scope.user.password = "";

  //--------------------------------- result callback  ------------------------------

  $scope.ok = function() {
    console.log("ok:", $scope.user);
    $modalInstance.close($scope.user);
  };

  $scope.cancel = function() {
    $modalInstance.dismiss('cancel');
  };
});
