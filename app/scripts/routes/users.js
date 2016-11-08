'use strict';
var app;

app = angular.module('eracordUiApp.routes');

app.config(function($routeProvider) {
  $routeProvider
    .when('/user/change_password', {
      templateUrl: 'views/users/edit.html',
      controller: 'UserCtrl',
      controllerAs: 'users'
    })
    .when('/user/verify_mobile', {
      templateUrl: 'views/users/verify_mobile.html',
      controller: 'UserCtrl',
      controllerAs: 'users'
    });
});

