'use strict';
var app;

app = angular.module('eracordUiApp.routes');

app.config(function($routeProvider) {
  $routeProvider
    .when('/teachers', {
      templateUrl: 'views/teachers/index.html',
      controller: 'TeachersCtrl',
      controllerAs: 'teachers'
    })
    .when('/organisations/teachers/new', {
      templateUrl: 'views/teachers/new.html',
      controller: 'TeachersCtrl'
    })
    .when('/organisations/teachers/:teacher_id', {
      templateUrl: 'views/teachers/show.html',
      controller: 'TeachersCtrl'
    })
    .when('/organisations/teachers/:teacher_id/edit', {
      templateUrl: 'views/teachers/new.html',
      controller: 'TeachersCtrl'
    });
    
});


