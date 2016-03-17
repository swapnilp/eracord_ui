'use strict';
var app;

app = angular.module('eracordUiApp.directives');

app.directive('dlKeyCode', function() {
  return {
    restrict: 'AE',
    transclude: true,
    link: function($scope, $element, $attrs) {
      $element.bind("keypress", function(event) {
        var keyCode = event.which || event.keyCode;
        if (keyCode == $attrs.code) {
          $scope.$apply(function() {
            $scope.$eval($attrs.dlKeyCode, {$event: event});
          });
	  
        }
      });
    }
  };
});
