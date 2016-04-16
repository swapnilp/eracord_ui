'use strict';
var app;

app = angular.module('eracordUiApp.directives');

app.directive('organisationProfile', function(Restangular) {
  return {
    restrict: 'AE',
    transclude: true,
    //scope: true,
    templateUrl: 'views/organisations/profile.html',
    controller: ['$scope', 'Restangular', 'Flash', '$location', function(scope, Restangular, Flash, $location){
      scope.profileRequestLoading = false;
      
      scope.loadProfile = function(){
	scope.profileRequestLoading = true;
	Restangular.all("").customGET("/organisation_profile").then(function(data){
	  if(data.success) {
	    scope.organisation = data.organisation;
	  } else {
	    $location.path('/admin_desk').replace();
	  }
	  scope.profileRequestLoading = false;
	});
      };

      scope.loadProfile();
      
    }]
  };
});
//end organisation profile

app.directive('organisationCources', function(Restangular) {
  return {
    restrict: 'AE',
    transclude: true,
    //scope: true,
    templateUrl: 'views/organisations/cources.html',
    controller: ['$scope', 'Restangular', 'Flash', '$location', function(scope, Restangular, Flash, $location){
      scope.cources = [];
      scope.requestLoading = true;
      
      var base_organisation = Restangular.all("organisations");
      
      scope.loadCources = function(){
	scope.requestLoading = true;
	Restangular.all("/organisations").customGET("cources").then(function(data){
	  if(data.success) {
	    scope.cources = data.body;
	    scope.isRoot = data.is_root;
	  }else{

	  }
	  scope.requestLoading = false;
	});
      };

      scope.disableStandard = function(row) {
	base_organisation.customGET("standard/"+row.standard_id+"/disable_standard").then(function(data){
	  if(data.success) {
	    row.is_active = false;
	  }
	});
      };

      scope.enableStandard = function(row) {
	base_organisation.customGET("standard/"+row.standard_id+"/enable_standard").then(function(data){
	  if(data.success) {
	    row.is_active = true;
	  }
	});
      };

      scope.loadCources();
      
      scope.launchSubOrganisation = function(){
	var standards = $('.organisationCoursesTable input:checked').map(
	  function () {return $(this).data('key');}).get().join(",");
	$location.path("/organisation/standards/" + standards + "/launch_sub_organisation").replace();
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
      scope.requestLoading = true;
      
      base_organisation.customGET('get_clarks').then(function(data){
	scope.clarks = data.data;
	scope.requestLoading = false;
      });

      scope.manageRoles = function(user){
	$location.path("/organisations/users/"+user.id+"/manage_roles");
      };

      scope.toggleEnableUser = function(user){
	base_organisation.customGET("users/"+user.id+"/toggleEnable", {enabled: user.is_enable});
      };

      scope.deleteClark = function(user) {
	if($window.confirm('Are you sure?')){
	  user.dataLoading = true;
	  base_organisation.one('clarks', user.id).remove().then(function(data){
	    if(data.success){
	      scope.clarks = _.reject(scope.clarks, function(obj){return obj.id == user.id});
	    }else {
	      Flash.create('warning', "Some thing went wrong", 'alert-danger');
	    }
	    user.dataLoading = false;
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
	if($window.confirm('Are you sure?')){
	  sub_organisation.dataLoading = true;
	  base_organisation.one('sub_organisations', sub_organisation.id).remove().then(function(data){
	    if(data.success) {
	      scope.loadCources();
	      scope.loadSubOrganisation();
	    }else {
	      Flash.create('warning', "Some thing went wrong", 'alert-danger');
	    }
	    sub_organisation.dataLoading = false;
	  });
	}
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
    template: '<div><span ng-click="toggleCheckbox();"><input type="checkbox" ng-model="value" data-key="{{key}}" />&nbsp;{{key}}</span></div>',
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
      scope.m_classes = scope.other_classes = [];
      scope.organisationClassesLoded = false;
      scope.requestLoading = true;
      
      scope.loadClasses = function(){
	scope.requestLoading = true;
	Restangular.all("/organisations").customGET('get_classes').then(function(data){
	  if(data.success){
	    scope.m_classes = data.classes;
	    scope.other_classes = data.other_classes;
	    scope.requestLoading = false;
	  }
      	});
      };

      scope.makeActiveClass = function(classId) {
	Restangular.one("jkci_classes", classId).customPOST({}, 'make_active_class', {}).then(function(data){
	  if(data.success) {
	    scope.m_classes = data.classes;
	  }
	});
      };
      
      scope.makeDeactiveClass = function(classId) {
	Restangular.one("jkci_classes", classId).customPOST({}, 'make_deactive_class', {}).then(function(data){
	  if(data.success) {
	    scope.m_classes = data.classes;
	  }
	});
      };
      
      scope.$watch('organisationClassesTab', function(){
	if(scope.organisationClassesTab === 'true'){
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
    controller: ['$scope', 'Restangular', 'Flash', '$location', '$cookieStore', '$window', function(scope, Restangular, Flash, $location, $cookieStore, $window){
      scope.classes = [];
      scope.organisation_id = $cookieStore.get('currentUser').organisation_id;
      scope.requestLoading = true;
      
      scope.loadOrganisationStandards = function(){
	scope.requestLoading = true;
	Restangular.all("/organisations").customGET('organisation_standards').then(function(data){
	  if(data.success){
	    scope.organisation_standards = data.organisation_standards;
	    scope.requestLoading = false;
	  }
      	});
      };

      scope.removeOrganisaitonStandard = function(standard, org) {
	if($window.confirm('Are you sure?')){
	  org.deleteLoading = true;
	  Restangular.all("/organisations").customPOST({standard_id: standard.id, organisation_id: org.organisation_id}, 'remove_standard_from_organisation', {}).then(function(data){
	    if(data.success) { 
	      standard.organisaitons = _.reject(standard.organisaitons, function(obj){return obj.organisation_id == org.organisation_id});
	    }
	    org.deleteLoading = false;
	  })
	}
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

app.directive('classBox', function(Restangular) {
  return {
    restrict: 'AE',
    transclude: true,
    scope: {
      makeDeactiveClass: '&',
      makeActiveClass: '&',
      jkClass: '=',
      hostUrl: '@'
    },
    templateUrl: 'views/organisations/class_view.html',
    controller: ['$scope', function(scope){
      scope.loadRequest = false;
      
      scope.activeClass = function(classId){
	scope.loadRequest = true;
	scope.makeActiveClass({classId: classId})
      };

      scope.deactiveClass = function(classId){
	scope.loadRequest = true;
	scope.makeDeactiveClass({classId: classId})
      };
      
    }]
  }
});
// end of organisation class_view
