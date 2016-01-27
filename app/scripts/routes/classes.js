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
      controllerAs: 'classes',
      reloadOnSearch: false
    })
    .when('/classes/:class_id/assign_students', {
      templateUrl: 'views/classes/assign_students.html',
      controller: 'ClassesCtrl',
      controllerAs: 'classes'
    })
    .when('/classes/:class_id/manage_student_subjects', {
      templateUrl: 'views/classes/manage_student_subjects.html',
      controller: 'ClassesCtrl',
      controllerAs: 'classes'
    })
    .when('/classes/:class_id/manage_student_rollnumber', {
      templateUrl: 'views/classes/manage_student_rollnumber.html',
      controller: 'ClassesCtrl',
      controllerAs: 'classes'
    })
    .when('/classes/:class_id/get_batch', {
      templateUrl: 'views/classes/get_batch.html',
      controller: 'ClassesCtrl',
      controllerAs: 'classes'
    });
});

