'use strict';
var app;

app = angular.module('eracordUiApp.services');

app.factory('authWrapper', function($rootScope, $q, $window, Flash, $cookieStore, $location) {
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
	  message = 'Please log in.';
          $location.path("/user/sign_in");
	  Flash.create('warning', message, 'alert-danger');
        break;
        case 403:
	  Flash.create('warning', 'You are not authorized to perform this action.', 'alert-danger');
	  $location.path("/admin_desk");
	  break;
	case 500:
	  console.log('asdasdasdad');
      }
      return $q.reject(rejection);
    }
  };
});

app.config(function($httpProvider) {
  return $httpProvider.interceptors.push('authWrapper');
});
