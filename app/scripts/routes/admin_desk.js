'use strict';
var app;

app = angular.module('eracordUiApp.routes');

app.config(function($routeProvider) {
  $routeProvider
    .when('/admin_desk', {
      templateUrl: 'views/admin_desk/index.html',
      controller: 'AdminDeskCtrl',
      controllerAs: 'admin_desk'
    });
});
