'use strict';
var app;

app = angular.module('eracordUiApp.directives');

app.directive('meetingsStudent', function(Restangular) {
  return {
    restrict: 'AE',
    transclude: true,
    scope: {
      meetingId: '@',
    },
    templateUrl: 'views/meetings/students.html',
    controller: ['$scope', 'Restangular', 'Flash', '$location', '$window', '$routeParams', '$route', 'Upload', '$cookieStore', function(scope, Restangular, Flash, $location, $window, $routeParams, $route, Upload, $cookieStore){

      scope.requestLoading = true;
      scope.studentLoaded = false;
      var jkci_classes = Restangular.one("parents_meetings", scope.meetingId);

    }]
  };
});

