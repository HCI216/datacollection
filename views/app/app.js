angular.module( 'sailng', [
  'ui.router',
  'ngSails',
  'angularMoment',
  'lodash',
  'angularMoment',
  'ui.bootstrap',
  'flash',
  'templates-app',
  'services',
  'models',
  'ngAnimate',
  'sailng.header',
  'sailng.footer',
  'sailng.home',
  'sailng.messages',
  'sailng.datasets',
  'sailng.templates',
  'sailng.dataset',
  'sailng.reports',
  'sailng.settings'
])

  .config( function myAppConfig ( $stateProvider, $urlRouterProvider, $locationProvider) {
    // $urlRouterProvider.otherwise( '/home' );
    $urlRouterProvider.otherwise(function ($injector, $location) {
      if ($location.$$url === '/') {
	window.location = '/home';
      }
      else {
	// pass through to let the web server handle this request
	window.location = $location.$$absUrl;
      }
    });
    $locationProvider.html5Mode(true);
  })

  .run( function run () {
    moment.locale('zh-CN');
  })

  .controller( 'AppCtrl', function AppCtrl ( $scope, config ) {
    config.currentUser = window.currentUser;
  })
  .controller('MessageCtrl', function MessageCtrl($scope,$rootScope, flash, $sails, $timeout,MessageModel ){

    $scope.flash = flash;
    $scope.ismsgshow = false;
    $sails.on('message', function (msg) {

      console.log("xxxxx-------------xxx:" + angular.toJson(msg));
      if (msg.verb === "created") {
        console.log("print msg title" + msg.data.title);
        flash(msg.data.title);
        $scope.ismsgshow=true;
        $timeout(function ontimeout(){
          $scope.ismsgshow=false;
          if(!$scope.$$phase) {
            $scope.$digest();
          }
        },8000);
      }
    });

    $rootScope.$on('notification', function (e,msg) {

      console.log("xxxxx-------------xxx:" + msg);

      console.log("print msg title" + msg);
      flash(msg);
      $scope.ismsgshow=true;
      $timeout(function ontimeout(){
        $scope.ismsgshow=false;
        if(!$scope.$$phase) {
          $scope.$digest();
        }
      },4000);
    });

    MessageModel.getAll($scope).then(function(models) {
      console.log("get all message");
      flash("new Message Arrived!");

      if(!$scope.$$phase) {
        $scope.$digest();
      }
    });

    flash("message info");

  });
