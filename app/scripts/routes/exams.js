'use strict';
var app;

app = angular.module('eracordUiApp.routes');

app.config(function($routeProvider) {
  $routeProvider
    .when('/exams', {
      templateUrl: 'views/exams/index.html',
      controller: 'ExamsCtrl',
      controllerAs: 'exams'
    });
});
