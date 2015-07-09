angular.module( 'sailng', [
  'ui.router',
  'sails.io',
  //'ngSails',
  'angularMoment',
  'angularFileUpload',
  'lodash',
  'angularMoment',
  'ui.bootstrap',
  //'flash',
  'templates-app',
  'services',
  'models',
  //'ngAnimate',
  'sailng.header',
  'sailng.footer',
  'sailng.home',
  'sailng.datasets',
  'sailng.dataset'
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
  });
