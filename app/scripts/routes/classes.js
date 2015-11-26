'use strict';
var app;

app = angular.module('eracordUiApp.routes');

app.config(function($routeProvider) {
  $routeProvider
    .when('/classes', {
      templateUrl: 'views/classes/index.html',
      controller: 'ClassesCtrl',
      controllerAs: 'classes'
    })
    .when('/classes/:class_id', {
      templateUrl: 'views/classes/show.html',
      controller: 'ClassesCtrl',
      controllerAs: 'classes'
    });
});

