'use strict';
var app;

app = angular.module('eracordUiApp.directives');

app.directive('organisationCources', function($timeout, Restangular) {
  return {
    restrict: 'AE',
    transclude: true,
    templateUrl: 'views/organisations/cources.html',
    controller: ['$scope', 'Restangular', function($scope, Restangular){
      Restangular.all("/organisation_cources").getList().then(function(organisation){
	$scope.cources = organisation;
      });
    }]
  };
});




app.directive('csSelect', function () {
  return {
    require: '^stTable',
    template: '<input type="checkbox"/>',
    scope: {
      row: '=csSelect'
    },
    link: function (scope, element, attr, ctrl) {
      
      element.bind('change', function (evt) {
        scope.$apply(function () {
          ctrl.select(scope.row, 'multiple');
	  if(element.find('input').is(':checked')){
	    scope.row.is_selected = true;
	  }else{
	    scope.row.is_selected = false;
	  }
	  
        });
      });
      
      scope.$watch('row.isSelected', function (newValue, oldValue) {
        if (newValue === true) {
          element.parent().addClass('st-selected');
        } else {
          element.parent().removeClass('st-selected');
        }
      });
    }
  };
});
