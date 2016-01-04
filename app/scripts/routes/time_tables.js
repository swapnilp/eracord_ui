'use strict';
var app;

app = angular.module('eracordUiApp.routes');

app.config(function($routeProvider) {
  $routeProvider
    .when('/classes/:class_id/time_tables/new', {
      templateUrl: 'views/time_tables/new_time_table.html',
      controller: 'TimeTablesCtrl',
      controllerAs: 'time_tables'
    })
    .when('/classes/:class_id/manage_time_tables', {
      templateUrl: 'views/time_tables/manage_time_table.html',
      controller: 'TimeTablesCtrl',
      controllerAs: 'time_tables'
    });
});


