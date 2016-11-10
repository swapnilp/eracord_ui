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
    controller: ['$rootScope', '$scope', 'Restangular', 'Flash', '$location', 'Upload', '$cookieStore', function($rootScope, scope, Restangular, Flash, $location, Upload, $cookieStore){
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

      scope.selectUploadFile = function(newVal){
	if(newVal){
	  scope.file = newVal;
	  scope.uploadingFile = false;
	  scope.fileName  = newVal.name;
	}
      };

      scope.submit = function() {
	if (scope.file) {
	  scope.uploadingFile = true;
	  scope.uploadMeaasgeClass = "alert-warning";
	  scope.uploadingMessage = "Uploading";
          scope.upload(scope.file);
	}
      };

      scope.upload = function (file) {
	scope.requestLoading = true;
        Upload.upload({
          url: "api/organisations/upload_logo",
          data: {organisation: {image: file}}
        }).then(function (resp) {
	  scope.requestLoading = false;
	  if(resp.data.success) {
	    scope.uploadMeaasgeClass = "alert-success";
	    scope.uploadingMessage = "Completed Successfully";
	    scope.fileName = "";
	    scope.file = null;
	    $rootScope.logoUrl = resp.data.url;
	    $rootScope.currentUser.logo_url = resp.data.url;
	    scope.organisation.logo_url = resp.data.url;
	    $cookieStore.remove('currentUser');
	    $cookieStore.put('currentUser', $rootScope.currentUser);
	  }else {
	    scope.uploadMeaasgeClass = "alert-danger";
	    scope.uploadingMessage = resp.data.message;
	  }
          //console.log('Success ' + resp.config.data.image.name + 'uploaded. Response: ' + resp.data);
        }, function (resp) {
	  scope.requestLoading = false;
	  scope.uploadingFile = false;
        }, function (evt) {
	  scope.requestLoading = false;
          //var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
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

      scope.$watch('organisationProfileTab', function(){
	if(scope.organisationProfileTab == 'true') {
	  loadCources();
	}
      });

    }]
  };
});


app.directive('organisationClerks', function(Restangular, $location, Flash) {
  return {
    restrict: 'AE',
    transclude: true,
    scope: {
      updateUrl: '&',
      organisationClerksTab: "@"
    },
    templateUrl: 'views/organisations/clerks.html',
    controller: ['$scope', 'Restangular', '$window', function(scope, Restangular, $window){
      var base_organisation = Restangular.all("organisations");
      scope.requestLoading = true;
      var clerksLoaded = false;
      
      var loadClerks = function() {
	base_organisation.customGET('get_clerks').then(function(data){
	  scope.clerks = data.data;
	  scope.user_clerks = data.user_clerks;
	  scope.requestLoading = false;
	});
      };
      
      scope.manageRoles = function(user){
	$location.path("/organisations/users/"+user.id+"/manage_roles");
      };

      scope.resendActivetionLink = function(user) {
	base_organisation.customGET('user_clerks/' + user.id + '/resend_invitation').then(function(data){
	  if(data.success) {
	    Flash.clear();
	    Flash.create('success', "Link has been sent on user's email.", 0, {}, true);
	    user.resend= true;
	  }else {
	    Flash.clear();
	    Flash.create('warning', data.message, 0, {}, true);
	  }
	});
      };
      
      scope.deleteUserClerk = function(user) {
	if($window.confirm('Are you sure?')){
	  user.dataLoading = true;
	  base_organisation.one('user_clerks', user.id).remove().then(function(data){
	    if(data.success){
	      scope.user_clerks = _.reject(scope.user_clerks, function(obj){return obj.id == user.id});
	    }else {
	      Flash.clear();
	      Flash.create('warning', "Some thing went wrong", 0, {}, true);
	    }
	    user.dataLoading = false;
	  });
	}
      };

      scope.toggleEnableUser = function(user){
	base_organisation.customGET("users/"+user.id+"/toggleEnable", {enabled: user.is_enable});
      };

      scope.deleteClerk = function(user) {
	if($window.confirm('Are you sure?')){
	  user.dataLoading = true;
	  base_organisation.one('clerks', user.id).remove().then(function(data){
	    if(data.success){
	      scope.clerks = _.reject(scope.clerks, function(obj){return obj.id == user.id});
	    }else {
	      Flash.clear();
	      Flash.create('warning', "Some thing went wrong", 0, {}, true);
	    }
	    user.dataLoading = false;
	  });
	}
      };

      scope.$watch('organisationClerksTab', function(){
	if(scope.organisationClerksTab === 'true') {
	  scope.updateUrl({tabName: 'clerks'});
	}
	if(scope.organisationClerksTab === 'true' && clerksLoaded === false){
	  loadClerks();
	  clerksLoaded = true;
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
	    }else {
	      Flash.clear();
	      Flash.create('warning', "Some thing went wrong", 0, {}, true);
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
    template: '<input id="std_{{row.standard_id}}" ng-model="row.is_selected" type="checkbox" data-key="{{row.standard_id}}"/> <label for="std_{{row.standard_id}}"></label>',
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
