'use strict';
var app;

app = angular.module('eracordUiApp.routes');

app.config(function($routeProvider) {
  $routeProvider
    .when('/user/change_password', {
      templateUrl: 'views/users/edit.html',
      controller: 'UserCtrl',
      controllerAs: 'users'
    });
});

