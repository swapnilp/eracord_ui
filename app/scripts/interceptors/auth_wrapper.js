'use strict';
var app;

app = angular.module('eracordUiApp.services');

app.factory('authWrapper', function($rootScope, $q, $window, Flash, $cookieStore) {
  return {
    request: function(config) {
      var user;
      if (config.headers === null) {
        config.headers = {};
      }
      if ($cookieStore.get('currentUser') !== null) {
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
          if (rejection.config.url.search(/sign_in/) !== -1) {
            //Flash.alert(message).andRefresh();
          } else {
            //Flash.setMsg('alert', message);
            $rootScope.$emit('auth:unauthorized', rejection.config.url.search(/sign_out/) !== -1);
          }
          break;
        case 403:
          //Flash.alert('You are not authorized to perform this action.').andRedirectTo('/');
      }
      return $q.reject(rejection);
    }
  };
});

app.config(function($httpProvider) {
  return $httpProvider.interceptors.push('authWrapper');
});
