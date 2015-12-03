'use strict';
var app;

app = angular.module('eracordUiApp.routes');

app.config(function($routeProvider) {
  $routeProvider
    .when('/daily_catlogs', {
      templateUrl: 'views/daily_catlogs/index.html',
      controller: 'DailyCatlogsCtrl',
      controllerAs: 'dailyCatlogs'
    })
    .when('/classes/:class_id/daily_catlogs/new', {
      templateUrl: 'views/daily_catlogs/new.html',
      controller: 'DailyCatlogsCtrl',
      controllerAs: 'dailyCatlogs'
    })
    .when('/classes/:class_id/daily_catlogs/:dtp_id/show', {
      templateUrl: 'views/daily_catlogs/show.html',
      controller: 'DailyCatlogsCtrl',
      controllerAs: 'dailyCatlogs'
    })
    .when('/classes/:class_id/daily_catlogs/:dtp_id/edit', {
      templateUrl: 'views/daily_catlogs/new.html',
      controller: 'DailyCatlogsCtrl',
      controllerAs: 'dailyCatlogs'
    });
});

