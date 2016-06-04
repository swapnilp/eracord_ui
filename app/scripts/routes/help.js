'use strict';
var app;

app = angular.module('eracordUiApp.routes');

app.config(function($routeProvider) {
  $routeProvider
    .when('/help', {
      templateUrl: 'views/help/index.html',
      controller: 'HelpCtrl',
      controllerAs: 'help'
    })
});
