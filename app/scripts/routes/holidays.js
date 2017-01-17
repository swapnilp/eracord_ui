'use strict';
var app;

app = angular.module('eracordUiApp.routes');

app.config(function($routeProvider) {
  $routeProvider
    .when('/holidays', {
      templateUrl: 'views/holidays/index.html',
      controller: 'HolidaysCtrl',
      controllerAs: 'holidays'
    })
    .when('/holidays/new', {
      templateUrl: 'views/holidays/new.html',
      controller: 'HolidaysCtrl',
      controllerAs: 'holidays'
    })
    .when('/holidays/:id', {
      templateUrl: 'views/holidays/show.html',
      controller: 'HolidaysCtrl',
      controllerAs: 'holidays'
    });
});
