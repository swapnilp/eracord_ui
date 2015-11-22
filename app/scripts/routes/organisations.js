'use strict';
var app;

app = angular.module('eracordUiApp.routes');

app.config(function($routeProvider) {
  $routeProvider
    .when('/manage_organisation', {
      templateUrl: 'views/organisations/index.html',
      controller: 'OrganisationsCtrl',
      controllerAs: 'organisations'
    })
    .when('/remaining_organisation_courses', {
      templateUrl: 'views/organisations/remaining_courses.html',
      controller: 'OrganisationsCtrl'
    });
});

