'use strict';
var app;

app = angular.module('eracordUiApp.directives');

app.directive('examCatlog', function(Restangular) {
  return {
    restrict: 'AE',
    transclude: true,
    scope: {
      exam: '=',
      classId: '@'
    },
    controller: ['$scope', 'Restangular', 'Flash', '$location', function(scope, Restangular, Flash, $location){
      var jkci_classes = Restangular.one("jkci_classes", scope.classId);
      
      scope.loadCatlog = function(){
	scope.examCatlogs = jkci_classes.one("exams", scope.exam.id).customGET("get_catlogs");
      }

      scope.loadCatlog();
      console.log(scope.examCatlogs);
    }]
  }
});
    
