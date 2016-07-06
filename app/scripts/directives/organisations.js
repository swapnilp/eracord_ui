'use strict';
var app;

app = angular.module('eracordUiApp.directives');

app.directive('organisationProfile', function(Restangular) {
  return {
    restrict: 'AE',
    transclude: true,
    scope: {
      updateUrl: '&',
      organisationProfileTab: "@"
    },
    templateUrl: 'views/organisations/profile.html',
    controller: ['$scope', 'Restangular', 'Flash', '$location', function(scope, Restangular, Flash, $location){
      scope.profileRequestLoading = false;
      var profileLoaded = false;
      
      scope.loadProfile = function(){
	scope.profileRequestLoading = true;
	Restangular.all("").customGET("/organisation_profile").then(function(data){
	  if(data.success) {
	    scope.organisation = data.organisation;
	    scope.is_root = data.is_root;
	  } else {
	    $location.path('/admin_desk').replace();
	  }
	  scope.profileRequestLoading = false;
	});
      };

      scope.loadProfile();
      scope.$watch('organisationProfileTab', function(){
	if(scope.organisationProfileTab == 'true') {
	  scope.updateUrl({tabName: 'profile'});
	}
      });
    }]
  };
});
//end organisation profile

app.directive('organisationCources', function(Restangular) {
  return {
    restrict: 'AE',
    transclude: true,
    scope: {
      organisationProfileTab: "@"
    },
    templateUrl: 'views/organisations/cources.html',
    controller: ['$scope', 'Restangular', 'Flash', '$location', function(scope, Restangular, Flash, $location){
      scope.cources = [];
      scope.requestLoading = true;
      var profileLoaded = false;
      
      var base_organisation = Restangular.all("organisations");
      
      var loadCources = function(){
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
      
      scope.launchSubOrganisation = function(){
	var standards = $('.organisationCoursesTable input:checked').map(
	  function () {return $(this).data('key');}).get().join(",");
	$location.path("/organisation/standards/" + standards + "/launch_sub_organisation").replace();
      };

      scope.isLaunchEnable = function (){
	var isSelected = _.pluck(scope.cources, 'is_selected');
        return _.contains(isSelected, true);
      };

      loadCources();
    }]
  };
});


app.directive('organisationClarks', function(Restangular, $location, Flash) {
  return {
    restrict: 'AE',
    transclude: true,
    scope: {
      updateUrl: '&',
      organisationClarksTab: "@"
    },
    templateUrl: 'views/organisations/clarks.html',
    controller: ['$scope', 'Restangular', '$window', function(scope, Restangular, $window){
      var base_organisation = Restangular.all("organisations");
      scope.requestLoading = true;
      var clarksLoaded = false;
      
      var loadClarks = function() {
	base_organisation.customGET('get_clarks').then(function(data){
	  scope.clarks = data.data;
	  scope.requestLoading = false;
	});
      };
      
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

      scope.$watch('organisationClarksTab', function(){
	if(scope.organisationClarksTab === 'true') {
	  scope.updateUrl({tabName: 'clarks'});
	}
	if(scope.organisationClarksTab === 'true' && clarksLoaded === false){
	  loadClarks();
	  clarksLoaded = true;
	}
      });
    }]
  };
});

app.directive('organisationTeachers', function(Restangular, $location, Flash) {
  return {
    restrict: 'AE',
    transclude: true,
    scope: {
      updateUrl: '&',
      organisationTeachersTab: "@"
    },
    templateUrl: 'views/teachers/index.html',
    controller: ['$scope', 'Restangular', '$window', function(scope, Restangular, $window){
      var base_organisation = Restangular.all("organisations");
      scope.requestLoading = true;
      var teachersLoaded = false;
      
      var loadTeachers = function() {
	base_organisation.customGET('teachers').then(function(data){
	  scope.teachers = data.teachers;
	  scope.requestLoading = false;
	});
      };

      scope.manageSubjects = function(teacher){
	$location.path("/organisations/teachers/"+teacher.id+"/teachers_subjects");
      };

      scope.toggleEnableUser = function(user){
	base_organisation.customGET("users/"+user.id+"/toggleEnable", {enabled: user.is_enable});
      };
      
      scope.$watch('organisationTeachersTab', function(){
	if(scope.organisationTeachersTab === 'true') {
	  scope.updateUrl({tabName: 'teachers'});
	}
	if(scope.organisationTeachersTab === 'true' && teachersLoaded === false){
	  loadTeachers();
	  teachersLoaded = true;
	}
      });
    }]
  };
});

app.directive('organisationSubOrganisations', function(Restangular, $location, Flash) {
  return {
    restrict: 'AE',
    transclude: true,
    scope: {
      updateUrl: '&',
      subOrganisationTab: "@"
    },
    templateUrl: 'views/organisations/sub_organisations.html',
    controller: ['$scope', 'Restangular', '$window', function(scope, Restangular, $window){
      var base_organisation = Restangular.all("organisations");
      var subOrganisationLoaded = false;
      
      var loadSubOrganisation = function(){
	base_organisation.customGET('get_sub_organisations').then(function(data){
	  scope.sub_organisations = data.organisations;
	});
      };
      
      scope.pullBackSubOrganisation = function(sub_organisation) {
	if($window.confirm('Are you sure?')){
	  sub_organisation.dataLoading = true;
	  base_organisation.one('sub_organisations', sub_organisation.id).remove().then(function(data){
	    if(data.success) {
	      scope.sub_organisations = _.reject(scope.sub_organisations, function(d){ return d.id === sub_organisation.id; });
	      loadCources();
	    }else {
	      Flash.create('warning', "Some thing went wrong", 'alert-danger');
	    }
	  });
	}
      }

      scope.$watch('subOrganisationTab', function(){
	if(scope.subOrganisationTab === 'true') {
	  scope.updateUrl({tabName: 'sub_organisation'});
	}
	if(scope.subOrganisationTab === 'true' && subOrganisationLoaded === false){
	  loadSubOrganisation();
	  subOrganisationLoaded = true;
	}
      });
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
      updateUrl: '&',
      organisationClassesTab: "@",
      hostUrl: '@'
    },
    templateUrl: 'views/organisations/classes.html',
    controller: ['$scope', 'Restangular', 'Flash', '$location', '$cookieStore', function(scope, Restangular, Flash, $location, $cookieStore){
      scope.m_classes = scope.other_classes = [];
      scope.organisationClassesLoded = false;
      scope.requestLoading = true;
      scope.token = $cookieStore.get('currentUser').token;
      
      var loadClasses = function(){
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
	  loadClasses();
	  scope.updateUrl({tabName: 'classes'});
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
      updateUrl: '&',
      organisationStandardTab: "@",
      hostUrl: '@'
    },
    templateUrl: 'views/organisations/organisation_standards.html',
    controller: ['$scope', 'Restangular', 'Flash', '$location', '$cookieStore', '$window', function(scope, Restangular, Flash, $location, $cookieStore, $window){
      scope.classes = [];
      scope.organisation_id = $cookieStore.get('currentUser').organisation_id;
      scope.requestLoading = true;
      
      var loadOrganisationStandards = function(){
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
	  scope.updateUrl({tabName: 'standards'});
	  loadOrganisationStandards();
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
      hostUrl: '@',
      token: '@'
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
