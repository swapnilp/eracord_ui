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
          message = rejection.data.message || 'Your session has expired. Please log in again.';
          $location.path("/");
          break;
        case 403:
          //Flash.alert('You are not authorized to perform this action.').andRedirectTo('/');
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
