'use strict';
var app;

app = angular.module('eracordUiApp.routes');

app.config(function($routeProvider) {
  $routeProvider
    .when('/exams', {
      templateUrl: 'views/exams/index.html',
      controller: 'ExamsCtrl',
      controllerAs: 'exams'
    })
    .when('/classes/:class_id/exams/new', {
      templateUrl: 'views/exams/new_exam.html',
      controller: 'ExamsCtrl',
      controllerAs: 'exams'
    })
    .when('/classes/:class_id/exams/:exam_id/show', {
      templateUrl: 'views/exams/show.html',
      controller: 'ExamsCtrl',
      controllerAs: 'exams'
    })
    .when('/classes/:class_id/exams/:exam_id/manage_points', {
      templateUrl: 'views/exams/manage_points.html',
      controller: 'ExamsCtrl',
      controllerAs: 'exams'
    })
    .when('/classes/:class_id/exams/:exam_id/edit', {
      templateUrl: 'views/exams/new_exam.html',
      controller: 'ExamsCtrl',
      controllerAs: 'exams'
    })
    .when('/classes/:class_id/exams/:exam_id/new_grouped_exams', {
      templateUrl: 'views/exams/new_exam.html',
      controller: 'ExamsCtrl',
      controllerAs: 'exams'
    });
});
