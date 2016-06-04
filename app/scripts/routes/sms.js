'use strict';
var app;

app = angular.module('eracordUiApp.routes');

app.config(function($routeProvider) {
  $routeProvider
    .when('/sms', {
      templateUrl: 'views/sms/index.html',
      controller: 'SmsCtrl',
      controllerAs: 'sms'
    })
});
