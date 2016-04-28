'use strict';
var app;

app = angular.module('eracordUiApp.routes');

app.config(function($routeProvider) {
  $routeProvider
    .when('/accounts', {
      templateUrl: 'views/accounts/index.html',
      controller: 'AccountsCtrl',
      controllerAs: 'accounts'
    })
    .when('/accounts/graphs', {
      templateUrl: 'views/accounts/graphs.html',
      controller: 'AccountsCtrl',
      controllerAs: 'accounts'
    })
    .when('/accounts/students/:student_id/fee_receipt/:receipt_id', {
      templateUrl: 'views/accounts/fee_receipt.html',
      controller: 'AccountsCtrl',
      controllerAs: 'accounts'
    });
});

