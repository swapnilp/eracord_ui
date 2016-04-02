'use strict';
var app;

app = angular.module('eracordUiApp.routes');

app.config(function($routeProvider) {
  $routeProvider
    .when('/class_rooms', {
      templateUrl: 'views/class_rooms/index.html',
      controller: 'ClassRoomsCtrl',
      controllerAs: 'class_rooms'
    });
});

