'use strict';
var app;

app = angular.module('eracordUiApp.routes');

app.config(function($routeProvider) {
  $routeProvider
    .when('/hostels', {
      templateUrl: 'views/hostels/index.html',
      controller: 'HostelsCtrl',
      controllerAs: 'hostels'
    })
    .when('/hostels/new', {
      templateUrl: 'views/hostels/new.html',
      controller: 'HostelsCtrl',
      controllerAs: 'hostels'
    })
    .when('/hostels/:id', {
      templateUrl: 'views/hostels/show.html',
      controller: 'HostelsCtrl',
      controllerAs: 'hostels'
    })
    .when('/hostels/:id/edit', {
      templateUrl: 'views/hostels/new.html',
      controller: 'HostelsCtrl',
      controllerAs: 'hostels'
    })
    .when('/hostels/:id/logs', {
      templateUrl: 'views/hostels/logs.html',
      controller: 'HostelsCtrl',
      controllerAs: 'hostels'
    });
});
