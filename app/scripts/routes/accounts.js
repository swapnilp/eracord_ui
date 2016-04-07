'use strict';
var app;

app = angular.module('eracordUiApp.routes');

app.config(function($routeProvider) {
  $routeProvider
    .when('/accounts', {
      templateUrl: 'views/accounts/index.html',
      controller: 'AccountsCtrl',
      controllerAs: 'accounts'
    });
});

