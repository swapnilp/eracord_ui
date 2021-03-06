'use strict';
var app;

app = angular.module('eracordUiApp.services');

app.factory('authWrapper', function($rootScope, $q, $window, Flash, lazyFlash, $cookieStore, $location) {
  return {
    request: function(config) {
      var user;
      if (config.headers === null) {
        config.headers = {};
      }
      if ($cookieStore.get('currentUser') !== undefined) {
        user = $cookieStore.get('currentUser'); //JSON.parse($window.localStorage.currentUser);
        config.headers.Authorization = "Bearer " + user.token;
      }
      return config;
    },
    responseError: function(rejection) {
      var message;
      switch (rejection.status) {
        case 401:
	  $cookieStore.remove('currentUser');
	  $rootScope.currentUser = {};
	  //message = 'Please log in.';
          $location.path("/user/sign_in");
	  //Flash.clear();
	  //Flash.create('warning', message, 0, {}, true);
        break;
        case 403:
	  lazyFlash.warning('You are not authorized to perform this action.');
	  $location.path("/admin_desk");
	  break;
	case 404:
	  Flash.clear();
	  Flash.create('warning', 'Record not found.', 0, {}, true);
	  break;
	case 500:
	  break;
      }
      return $q.reject(rejection);
    }
  };
});

app.config(function($httpProvider) {
  return $httpProvider.interceptors.push('authWrapper');
});
