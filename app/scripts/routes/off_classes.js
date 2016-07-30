'use strict';
var app;

app = angular.module('eracordUiApp.routes');

app.config(function($routeProvider) {
  $routeProvider
    .when('/off_classes', {
      templateUrl: 'views/off_classes/index.html',
      controller: 'OffClassesCtrl',
      controllerAs: 'off_lcasses'
    });
});
