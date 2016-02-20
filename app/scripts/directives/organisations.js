'use strict';
var app;

app = angular.module('eracordUiApp.directives');

app.directive('organisationCources', function(Restangular) {
  return {
    restrict: 'AE',
    transclude: true,
    //scope: true,
    templateUrl: 'views/organisations/cources.html',
    controller: ['$scope', 'Restangular', 'Flash', '$location', function(scope, Restangular, Flash, $location){
      scope.cources = [];

      scope.loadCources = function(){
	Restangular.all("/organisation_cources").getList().then(function(data){
	  scope.cources = data;
	});
      };

      scope.loadCources();
      
      scope.launchSubOrganisation = function(){
	var standards = $('.organisationCoursesTable input:checked').map(
	  function () {return $(this).data('key');}).get().join(",");
	$location.path("/organisation/standards/" + standards + "/launch_sub_organisation");
      };

      scope.isLaunchEnable = function (){
	var isSelected = _.pluck(scope.cources, 'is_selected');
        return _.contains(isSelected, true);
      };
      
    }]
  };
});


app.directive('organisationClarks', function(Restangular, $location, Flash) {
  return {
    restrict: 'AE',
    transclude: true,
    scope: true,
    templateUrl: 'views/organisations/clarks.html',
    controller: ['$scope', 'Restangular', '$window', function(scope, Restangular, $window){
      var base_organisation = Restangular.all("organisations");
      base_organisation.customGET('get_clarks').then(function(data){
	scope.clarks = data.data;
      });

      scope.manageRoles = function(user){
	$location.path("/organisations/users/"+user.id+"/manage_roles");
      };

      scope.toggleEnableUser = function(user){
	base_organisation.customGET("users/"+user.id+"/toggleEnable", {enabled: user.is_enable});
      };

      scope.deleteClark = function(user) {
	if($window.confirm('Are you sure?')){
	  base_organisation.one('clarks', user.id).remove().then(function(data){
	    if(data.success){
	      scope.clarks = _.reject(scope.clarks, function(obj){return obj.id == user.id});
	    }else {
	      Flash.create('warning', "Some thing went wrong", 'alert-danger');
	    }
	  });
	}
      };
    }]
  };
});

app.directive('organisationSubOrganisations', function(Restangular, $location, Flash) {
  return {
    restrict: 'AE',
    transclude: true,
    scope: true,
    templateUrl: 'views/organisations/sub_organisations.html',
    controller: ['$scope', 'Restangular', '$window', function(scope, Restangular, $window){
      var base_organisation = Restangular.all("organisations");
      scope.loadSubOrganisation = function(){
	base_organisation.customGET('get_sub_organisations').then(function(data){
	  scope.sub_organisations = data.organisations;
	});
      };
      scope.loadSubOrganisation();
      scope.pullBackSubOrganisation = function(sub_organisation) {
	base_organisation.one('sub_organisations', sub_organisation.id).remove().then(function(data){
	  if(data.success) {
	    scope.loadCources();
	    scope.loadSubOrganisation();
	  }else {
	    Flash.create('warning', "Some thing went wrong", 'alert-danger');
	  }
	})
      }
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

app.directive('organisationClasses', function(Restangular) {
  return {
    restrict: 'AE',
    transclude: true,
    scope: {
      organisationClassesTab: "@",
      hostUrl: '@'
    },
    templateUrl: 'views/organisations/classes.html',
    controller: ['$scope', 'Restangular', 'Flash', '$location', function(scope, Restangular, Flash, $location){
      scope.classes = [];
      scope.organisationClassesLoded = false;
      
      scope.loadClasses = function(){
	Restangular.all("/organisations").customGET('get_classes').then(function(data){
	  if(data.success){
	    scope.classes = data.classes;
	    scope.other_classes = data.other_classes;
	  }
      	});
      };

      scope.makeActiveClass = function(classId) {
	Restangular.one("jkci_classes", classId).customPOST({}, 'make_active_class', {}).then(function(data){
	  if(data.success) {
	    scope.classes = data.classes;
	  }
	});
      };
      
      scope.$watch('organisationClassesTab', function(){
	if(scope.organisationClassesTab === 'true' && scope.organisationClassesLoded === false){
	  scope.loadClasses();
	  //scope.organisationClassesLoded = true;
	}
      })
    }]
  };
});
//end of organisation classes

app.directive('organisationStandards', function(Restangular) {
  return {
    restrict: 'AE',
    transclude: true,
    scope: {
      organisationStandardTab: "@",
      hostUrl: '@'
    },
    templateUrl: 'views/organisations/organisation_standards.html',
    controller: ['$scope', 'Restangular', 'Flash', '$location', '$cookieStore', function(scope, Restangular, Flash, $location, $cookieStore){
      scope.classes = [];
      scope.organisation_id = $cookieStore.get('currentUser').organisation_id;
      
      scope.loadOrganisationStandards = function(){
	Restangular.all("/organisations").customGET('organisation_standards').then(function(data){
	  if(data.success){
	    scope.organisation_standards = data.organisation_standards;
	  }
      	});
      };

      scope.removeOrganisaitonStandard = function(standard, org_id) {
	Restangular.all("/organisations").customPOST({standard_id: standard.id, organisation_id: org_id}, 'remove_standard_from_organisation', {}).then(function(data){
	  if(data.success) { 
	    standard.organisaitons = _.reject(standard.organisaitons, function(obj){return obj.organisation_id == org_id});
	  }
	})	
      }

      scope.$watch('organisationStandardTab', function(){
	if(scope.organisationStandardTab === 'true'){
	  scope.loadOrganisationStandards();
	  //scope.organisationClassesLoded = true;
	}
      })
    }]
  };
});
// end of organisation Standards
