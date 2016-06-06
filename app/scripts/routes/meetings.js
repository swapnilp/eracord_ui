'use strict';
var app;

app = angular.module('eracordUiApp.routes');

app.config(function($routeProvider) {
  $routeProvider
    .when('/meetings', {
      templateUrl: 'views/meetings/index.html',
      controller: 'MeetingsCtrl',
      controllerAs: 'meetings'
    })
    .when('/meetings/new', {
      templateUrl: 'views/meetings/new.html',
      controller: 'MeetingsCtrl',
      controllerAs: 'meetings'
    })
    .when('/meetings/:id/show', {
      templateUrl: 'views/meetings/show.html',
      controller: 'MeetingsCtrl',
      controllerAs: 'meetings'
    });
});
