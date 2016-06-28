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
    })
    .when('/organisations/users/:user_id/manage_roles', {
      templateUrl: 'views/organisations/manage_user_roles.html',
      controller: 'OrganisationsCtrl'
    })
    .when('/add_organisation_clark', {
      templateUrl: 'views/organisations/new_organisation_clark.html',
      controller: 'OrganisationsCtrl'
    })
    .when('/organisations/teachers/new', {
      templateUrl: 'views/teachers/new.html',
      controller: 'OrganisationsCtrl'
    })
    .when('/organisations/teachers/:teacher_id/edit', {
      templateUrl: 'views/teachers/new.html',
      controller: 'OrganisationsCtrl'
    })
    .when('/edit_organisation', {
      templateUrl: 'views/organisations/edit_organisation.html',
      controller: 'OrganisationsCtrl'
    })
    .when('/organisation/users/:user_id/change_password', {
      templateUrl: 'views/organisations/change_clark_password.html',
      controller: 'OrganisationsCtrl'
    })
    .when('/organisation/standards/:standard_ids/launch_sub_organisation', {
      templateUrl: 'views/organisations/launch_sub_organisation.html',
      controller: 'OrganisationsCtrl'
    })
    .when("/organisation/standards/:id/assign_organisation", {
      templateUrl: 'views/organisations/remaining_standards_organisation.html',
      controller: 'OrganisationsCtrl'
    })
    .when("/organisations/:course_id/fees/edit", {
      templateUrl: 'views/organisations/manage_fee.html',
      controller: 'OrganisationsCtrl'
    })
    .when("/organisations/classes/:class_id/fees/edit", {
      templateUrl: 'views/organisations/manage_fee.html',
      controller: 'OrganisationsCtrl'
    });

    

});

