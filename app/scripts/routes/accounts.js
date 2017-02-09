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
    .when('/accounts/logs', {
      templateUrl: 'views/accounts/logs.html',
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
    })
    .when('/accounts/print_account', {
      templateUrl: 'views/accounts/print_account.html',
      controller: 'AccountsCtrl',
      controllerAs: 'accounts'
    })
    .when('/accounts/vendors', {
      templateUrl: 'views/accounts/vendors.html',
      controller: 'AccountsCtrl',
      controllerAs: 'accounts'
    })
    .when('/accounts/vendors/:vendor_id', {
      templateUrl: 'views/accounts/vendor_show.html',
      controller: 'AccountsCtrl',
      controllerAs: 'accounts'
    });
});

