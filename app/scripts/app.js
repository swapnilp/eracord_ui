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
    'daterangepicker',
    'angular-confirm',
    'angularLazyImg',
    'filereader',
    'ngDragDrop',
    'pascalprecht.translate',// angular-translate
    'tmh.dynamicLocale',// angular-dynamic-locale
    'eracordUiApp.controller',
    'eracordUiApp.directives'
  ])

  .constant('LOCALES', {
    'locales': {
      'hi_IN': 'हिंदी',
      'en_US': 'English'
    },
    'preferredLocale': 'en_US'
  })

  .config(function ($routeProvider, RestangularProvider, AuthProvider, ChartJsProvider, $translateProvider, tmhDynamicLocaleProvider) {
    AuthProvider.loginPath('/api/users/sign_in.json');
    AuthProvider.logoutPath('/api/users/sign_out.json');
    
    window['moment-range'].extendMoment(moment);
    ChartJsProvider.setOptions({ colors : [ '#803690', '#00ADF9', '#46BFBD', '#FDB45C', '#949FB1', '#4D5360'] });
    
    // Intercept 401 Unauthorized everywhere
    // Enables `devise:unauthorized` interceptor
    RestangularProvider.setBaseUrl('/api');
    RestangularProvider.setRequestSuffix('.json');
    RestangularProvider.setDefaultHeaders({
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Accept, X-Requested-With'
    });
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
    
    $translateProvider.useStaticFilesLoader({
      prefix: 'i18n/locale-',// path to translations files
      suffix: '.json'// suffix, currently- extension of the translations
    });
    //$translateProvider.preferredLanguage('en_US');// is applied on first load
    //$translateProvider.useLocalStorage();// saves selected language to localStorage
    //tmhDynamicLocaleProvider.localeLocationPattern('i18n/locale-{{locale}}.json');

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

