'use strict';

/**
 * @ngdoc overview
 * @name eracordUiApp
 * @description
 * # eracordUiApp
 *
 * Main module of the application.
 */
angular.module('eracordUiApp.controller', []);
angular.module('eracordUiApp.directives', []);
angular.module('eracordUiApp.filters', []);
angular.module('eracordUiApp.routes', []);

angular
  .module('eracordUiApp', [
    'eracordUiApp.controller',
    'eracordUiApp.directives',
    'eracordUiApp.filters',
    'eracordUiApp.routes',
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'flash',
    'Devise',
    'restangular'
  ])

  .config(function ($routeProvider, RestangularProvider, AuthProvider) {
    AuthProvider.loginPath('/api/users/sign_in.json');
    AuthProvider.logoutPath('/api/users/sign_out.json');
    
    // Intercept 401 Unauthorized everywhere
    // Enables `devise:unauthorized` interceptor
    RestangularProvider.setBaseUrl('/api');

    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .when('/user/sign_in', {
        templateUrl: 'views/users/sign_in.html',
        controller: 'UserCtrl',
        controllerAs: 'about'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
