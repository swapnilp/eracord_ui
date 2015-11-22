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


app.directive('organisationClarks', function($timeout, Restangular, $location) {
  return {
    restrict: 'AE',
    transclude: true,
    templateUrl: 'views/organisations/clarks.html',
    controller: ['$scope', 'Restangular', function($scope, Restangular){
      var base_organisation = Restangular.all("organisations");
      base_organisation.customGET('get_clarks').then(function(data){
	$scope.clarks = data.data;
      });

      $scope.manageRoles = function(user){
	$location.path("/organisations/users/"+user.id+"/manage_roles");
      };
      
      $scope.disableUser = function(user){
	base_organisation.customGET("users/"+user.id+"/roles");
	console.log(user);
      };
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

app.directive('roleSelect', function () {
  return {
    restrict: 'AE',
    transclude: true,
    template: '<div ng-click="toggleCheckbox();"><input type="checkbox" ng-model="value" data-key="{{key}}"/>&nbsp;{{key}}</div>',
    scope: {
      key: '=',
      value: '='
    },
    link: function (scope, element, attr, ctrl) {
      
      scope.toggleCheckbox = function(){
	scope.value = !scope.value;
      }
      
    }
  };
});
