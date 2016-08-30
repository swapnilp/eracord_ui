'use strict';
var app;

app = angular.module('eracordUiApp.routes');

app.config(function($routeProvider) {
  $routeProvider
    .when('/students', {
      templateUrl: 'views/students/index.html',
      controller: 'StudentsCtrl',
      controllerAs: 'students'
    })
    .when('/students/new', {
      templateUrl: 'views/students/new.html',
      controller: 'StudentsCtrl',
      controllerAs: 'students'
    })
    .when('/classes/:class_id/students/new', {
      templateUrl: 'views/students/new.html',
      controller: 'StudentsCtrl',
      controllerAs: 'students'
    })
    .when('/students/:student_id/show', {
      templateUrl: 'views/students/show.html',
      controller: 'StudentsCtrl',
      controllerAs: 'students'
    })
    .when('/students/:student_id/edit', {
      templateUrl: 'views/students/new.html',
      controller: 'StudentsCtrl',
      controllerAs: 'students'
    })
    .when('/students/:student_id/pay_fee', {
      templateUrl: 'views/students/pay_fee.html',
      controller: 'StudentsCtrl',
      controllerAs: 'students'
    })
    .when('/students/:student_id/pay_other_fee', {
      templateUrl: 'views/students/pay_other_fee.html',
      controller: 'StudentsCtrl',
      controllerAs: 'students'
    })
    .when('/students/:student_id/payment_info', {
      templateUrl: 'views/students/payment_info.html',
      controller: 'StudentsCtrl',
      controllerAs: 'students'
    })
    .when('/students/:student_id/get_clearance', {
      templateUrl: 'views/students/get_clearance.html',
      controller: 'StudentsCtrl',
      controllerAs: 'students'
    });
    
});

