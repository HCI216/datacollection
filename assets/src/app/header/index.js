angular.module('sailng.header', [])

.controller('HeaderCtrl', function HeaderController($scope, $state, config, $modal, $log) {
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

    $scope.parseEvent = function($url) {
      return $url;
    }

    $scope.login = function() {

      var modalInstance = $modal.open({
        templateUrl: 'header/login.tpl.html',
        controller: 'loginCtrl',
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
  })

.controller('loginCtrl', function($scope, $modalInstance, FileUploader, datasetsInfo) {
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
