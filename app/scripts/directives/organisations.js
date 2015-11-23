'use strict';
var app;

app = angular.module('eracordUiApp.directives');

app.directive('organisationCources', function(Restangular) {
  return {
    restrict: 'AE',
    transclude: true,
    templateUrl: 'views/organisations/cources.html',
    controller: ['$scope', 'Restangular', 'Flash', '$location', function($scope, Restangular, Flash, $location){
      $scope.cources = [];
      Restangular.all("/organisation_cources").getList().then(function(organisations){
	$scope.cources = organisations;
      });
      
      $scope.launchSubOrganisation = function(){
	var standards = $('.organisationCoursesTable input:checked').map(
	  function () {return $(this).data('key');}).get().join(",");
	$location.path("/organisation/standards/" + standards + "/launch_sub_organisation");
      };

      $scope.isLaunchEnable = function (){
	var isSelected = _.pluck($scope.cources, 'is_selected');
        return _.contains(isSelected, true);
      };
      
    }]
  };
});


app.directive('organisationClarks', function(Restangular, $location, Flash) {
  return {
    restrict: 'AE',
    transclude: true,
    templateUrl: 'views/organisations/clarks.html',
    controller: ['$scope', 'Restangular', '$window', function($scope, Restangular, $window){
      var base_organisation = Restangular.all("organisations");
      base_organisation.customGET('get_clarks').then(function(data){
	$scope.clarks = data.data;
      });

      $scope.manageRoles = function(user){
	$location.path("/organisations/users/"+user.id+"/manage_roles");
      };

      $scope.toggleEnableUser = function(user){
	base_organisation.customGET("users/"+user.id+"/toggleEnable", {enabled: user.is_enable});
      };

      $scope.deleteClark = function(user) {
	if($window.confirm('Are you sure?')){
	  base_organisation.one('clarks', user.id).remove().then(function(data){
	    if(data.success){
	      $scope.clarks = _.reject($scope.clarks, function(obj){return obj.id == user.id});
	    }else{
	      Flash.create('warning', "Some thing went wrong", 'alert-danger');
	    }
	  });
	}
      };
    }]
  };
});


app.directive('csSelect', function () {
  return {
    require: '^stTable',
    template: '<input ng-model="row.is_selected" type="checkbox" data-key="{{row.standard_id}}"/>',
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
      };
      
    }
  };
});
