'use strict';
var app;

app = angular.module('eracordUiApp.routes');

app.config(function($routeProvider) {
  $routeProvider
    .when('/classes/:class_id/divisions/:division_id', {
      templateUrl: 'views/divisions/show.html',
      controller: 'DivisionsCtrl',
      controllerAs: 'divisions'
    });
});

