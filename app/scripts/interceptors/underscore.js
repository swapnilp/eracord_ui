'use strict';
var app;

app = angular.module('eracordUiApp.services');


//var underscore = angular.module('underscore', []);
app.factory('_', ['$window', function($window) {
  return $window._; // assumes underscore has already been loaded on the page
}]);
