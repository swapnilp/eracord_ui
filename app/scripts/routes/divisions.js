'use strict';
var app;

app = angular.module('eracordUiApp.routes');

app.config(function($routeProvider) {
  $routeProvider
    .when('/classes/:class_id/divisions/new', {
      templateUrl: 'views/divisions/new_divisions.html',
      controller: 'DivisionsCtrl',
      controllerAs: 'divisions'
    })
    .when('/classes/:class_id/divisions/:division_id', {
      templateUrl: 'views/divisions/show.html',
      controller: 'DivisionsCtrl',
      controllerAs: 'divisions'
    })
    .when('/classes/:class_id/divisions/:division_id/assign_students', {
      templateUrl: 'views/classes/assign_students.html',
      controller: 'DivisionsCtrl',
      controllerAs: 'divisions'
    });
});

