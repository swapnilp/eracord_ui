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
angular.module('eracordUiApp.services', []);

angular
  .module('eracordUiApp', [
    'chart.js',
    'eracordUiApp.filters',
    'eracordUiApp.services',
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'eracordUiApp.routes',
    'ngSanitize',
    'ngTouch',
    'ngFlash',
    'Devise',
    'restangular',
    'ngCookies',
    'ui.calendar',
    'ui.bootstrap',
    'ui.bootstrap.datetimepicker',
    'smart-table',
    'toggle-switch',
    'angular-multi-select',
    'ngFileUpload',
    'checklist-model',
    'angularUtils.directives.dirPagination',
    'eracordUiApp.controller',
    'eracordUiApp.directives'
  ])

  .config(function ($routeProvider, RestangularProvider, AuthProvider, ChartJsProvider) {
    AuthProvider.loginPath('/api/users/sign_in.json');
    AuthProvider.logoutPath('/api/users/sign_out.json');
    
    ChartJsProvider.setOptions({ colors : [ '#803690', '#00ADF9', '#46BFBD', '#FDB45C', '#949FB1', '#4D5360'] });
    
    // Intercept 401 Unauthorized everywhere
    // Enables `devise:unauthorized` interceptor
    RestangularProvider.setBaseUrl('/api');
    RestangularProvider.setRequestSuffix('.json');
    RestangularProvider.addResponseInterceptor(function(data, operation, what, url, response, deferred) {
      var extractedData;
      if (operation === "getList") {
	if(data.count){
          extractedData = [data.body, data.count, data];
	}else {
	   extractedData = data.body;
	}
      } else {
        extractedData = data;
      }
      return extractedData;
    });

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
      .when('/user/forgot_password', {
        templateUrl: 'views/users/forgot_password.html',
        controller: 'UserCtrl',
        controllerAs: 'about'
      })
      .when('/contact', {
        templateUrl: 'views/contacts/contact.html',
        controller: 'ContactCtrl',
        controllerAs: 'contact'
      })
      .otherwise({
        redirectTo: '/'
      });
  });

