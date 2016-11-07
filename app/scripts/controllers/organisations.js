'use strict';

/**
 * @ngdoc function
 * @name eracordUiApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the eracordUiApp
 */
angular.module('eracordUiApp.controller')
  .controller('OrganisationsCtrl',['$rootScope', '$scope', 'Flash', 'lazyFlash', '$location', 'Auth', 'Restangular', '$routeParams', 'Upload', '$window', '$route', '$cookieStore', '$uibModal', function ($rootScope, $scope, Flash, lazyFlash, $location, Auth, Restangular, $routeParams, Upload, $window, $route, $cookieStore, $uibModal) {

    if(!Auth.isAuthenticated()){
      $location.path('/user/sign_in');
      return true;
    }
    
    var base_organisation;

    if($location.path() === '/remaining_organisation_courses') {
      var cources = Restangular.all("/remaining_cources");
      cources.getList().then(function(data){
	$scope.cources = data;
      });
      
      $scope.saveList = function() {
	var a = _.where($scope.cources, {is_selected: true});
	
	if(a.length > 0){
	  Restangular.all("organisations").customGET('add_standards', {ids: _.pluck(a, 'id')}).then(function(data){
	    if(data.success){
	      $location.path('/manage_organisation').replace();
	    }
	  });
	}
      };
    }

    if($location.path() === "/organisations/users/"+$routeParams.user_id+"/manage_roles") {
      base_organisation = Restangular.all("organisations");
      $scope.requestLoading = true;
      $scope.rolesList = [];
      base_organisation.customGET("users/"+$routeParams.user_id+"/get_roles").then(function(data){
	$scope.roles = data.roles;
	$scope.rolesList = $scope.roles;
	$scope.clarks_roles = data.clarks_roles;
	$scope.user_id = $routeParams.user_id;
	$scope.requestLoading = false;

      });

      $scope.saveRoles = function(user_id){
	//$('.userRoles input:')
	var roles = $scope.rolesList.join();
	base_organisation.customPOST({roles: roles, user_id: $scope.user_id}, 'users/' + $scope.user_id + '/update_roles', {})
	  .then(function(data){
	    if(data.success){
	      lazyFlash.success("User roles has been saved");
	      $location.path('/manage_organisation').replace();
	    }
	  });
      }
    }
    
    if($location.path() === "/add_organisation_clark") {
      base_organisation = Restangular.all("organisations");
      $scope.registerUser = function(){
	$scope.vm.dataLoading = true;
	$scope.vm.user.role = 'clark';
	base_organisation.customPOST({clark: $scope.vm.user}, 'users/create_organisation_clark', {}).then(function(data){
	  if(data.success){
	    lazyFlash.success("New Clark has been created");
	    $location.path('/manage_organisation').search({tab: 'clarks'}).replace();
	  }else{
	    $scope.vm.dataLoading = false;
	    Flash.clear();
	    Flash.create('warning', data.message, 0, {}, true);
	  }
	});
      };
    }

    
    
    if($location.path() === "/organisation/standards/" + $routeParams.standard_ids + "/launch_sub_organisation"){
      base_organisation = Restangular.all("organisations");
      $scope.requestLoading = true;
      $scope.dataLoading = false;
      
      base_organisation.customGET('get_standards', {standards: $routeParams.standard_ids}).then(function(data){
	$scope.standards = data.organisations;
	if($scope.standards.length == 0){
	  $location.path('/manage_organisation').replace();
	}
	$scope.name = _.map($scope.standards, function(obj){ return obj.name + '-' + obj.stream }).join(', ');
	$scope.requestLoading = false;
      });

      $scope.registerOrganisation = function(){
	$scope.dataLoading = true;
	var std_ids = _.pluck($scope.standards, 'id').join(',');
	base_organisation.customPOST({organisation: $scope.vm.org, standard_ids: std_ids}, "sub_organisation/launch_organisation", {}).then(function(data){
	  if(data.success) {
	    lazyFlash.success("Sub organisation has been created successfully");
	    $location.path('/manage_organisation').replace();
	  } else {
	    Flash.clear();
	    Flash.create('warning', data.message, 0, {}, true);
	  }
	  $scope.dataLoading = false;
	});
      };
    }

    if($location.path() === "/organisation/standards/" + $routeParams.id + "/assign_organisation"){
      $scope.sub_organisations = [];
      $scope.dataLoading = false;
      $scope.requestLoading = true;
      
      $scope.vm = {standard_id: $routeParams.id};
      base_organisation = Restangular.all("organisations");
      base_organisation.one('standard', $routeParams.id).customGET('remaining_organisations').then(function(data){
      	if(data.success) {
	  $scope.sub_organisations = data.body;
	} else {
	  lazyFlash.warning(data.message);
	  $location.path('/manage_organisation').replace();
	}
	$scope.requestLoading = false;
      });
      
      $scope.registorOrganisation = function(){
	$scope.dataLoading = true;
      	base_organisation.customPOST({switch_organisation_standard: $scope.vm}, "switch_organisation_standard", {}).then(function(data){
      	  if(data.success) {
	    $location.path('/manage_organisation').replace();
      	  }else{
	    Flash.clear();
	    Flash.create('warning', data.message, 0, {}, true);
	  }
	  $scope.dataLoading = false;
      	});
      };
    }
    //end assign standards

    if($location.path() === "/organisations/" + $routeParams.course_id + "/fees/edit"){
      base_organisation = Restangular.all("organisations");
      $scope.vm = {};
      $scope.requestLoading = true;
      
      base_organisation.one("courses", $routeParams.course_id).customGET("get_fee").then(function(data) {
	if(data.success) {
	  $scope.class_name = data.name;
	  $scope.fee = data.fee;
	  $scope.vm.fee = $scope.fee;
	} else {
	  lazyFlash.warning(data.message);
	  $location.path('/manage_organisation').replace();
	}
	$scope.requestLoading = false;
      });

      $scope.updateFee = function() {
	base_organisation.one("courses", $routeParams.course_id).customPOST({fee: $scope.vm},"update_fee", {}).then(function(data) {
	  if(data.success) {
	    lazyFlash.success(data.message);
	    $location.path('/manage_organisation').replace();
	  } else {
	    Flash.clear();
	    Flash.create('warning', data.message, 0, {}, true);
	    $scope.vm.password = "";
	  }
	});
      }
      
    }
    //end manage fee


    if($location.path() === "/organisations/classes/"+$routeParams.class_id+"/fees/edit"){
      base_organisation = Restangular.all("organisations");
      $scope.vm = {};
      $scope.requestLoading = true;
      
      base_organisation.one("classes", $routeParams.class_id).customGET("get_fee").then(function(data) {
	if(data.success) {
	  $scope.class_name = data.name;
	  $scope.fee = data.fee;
	  $scope.vm.fee = $scope.fee;
	} else {
	  lazyFlash.warning(data.message);
	  $location.path('/manage_organisation').search({tab: 'classes'}).replace();
	}
	$scope.requestLoading = false;
      });

      $scope.updateFee = function() {
	base_organisation.one("classes", $routeParams.class_id).customPOST({fee: $scope.vm},"update_fee", {}).then(function(data) {
	  if(data.success) {
	    lazyFlash.success(data.message);
	    $location.path('/manage_organisation').replace();
	  } else {
	    Flash.clear();
	    Flash.create('warning', data.message, 0, {}, true);
	    $scope.vm.password = "";
	  }
	});
      }
      
    }
    //end class manage fee
    
    
    if($location.path() === '/edit_organisation') {
      $scope.vm = {};
      Restangular.all("").customGET("organisation_edit").then(function(data){
	if(data.success) {
	  $scope.vm = data.organisation;
	  $scope.is_root = data.is_root;
	} else {
	  $location.path('/admin_desk').replace();
	}
      });

      $scope.updateOrganisation = function() {
	Restangular.all("").customPOST({organisation: $scope.vm}, "update_organisation", {}).then(function(data){
	  if(data.success) {
	    $location.path('/manage_organisation').replace();
	  }else {
	    if(data.message == "Unauthorised"){
	      $location.path('/admin_desk').replace();
	    }else{
	      $scope.vm.password = "";
	    }
	  }
	});
      };
    }

    if($location.path() === '/manage_organisation') {

      $scope.isRoot = $cookieStore.get('currentUser').is_root;;
      var loadTabs = function(selectTab){
	if(selectTab === 'standards') {
	  $scope.organisationStandardTab = true;
	} else if(selectTab === 'classes') {
	  $scope.organisationClassesTab = true;
	} else if(selectTab === 'clarks') {
	  $scope.organisationClarksTab = true;
	} else if (selectTab === 'teachers'){
	  $scope.organisationTeachersTab = true;
	} else if (selectTab === 'sub_organisation'){
	  $scope.subOrganisationTab = true;
	} else {
	  $scope.organisationProfileTab = true;
	}
      };

      loadTabs($routeParams.tab);
      
      if($routeParams.standards_manage) {
	$scope.organisationStandardTab = true;
      }
      
      $scope.updateTabParams = function(tabName){
	$route.updateParams({ tab: tabName, page: null});
      };
    }
    //var exams = Restangular.all("exams").getList();
    //Flash.create('success', message, 'custom-class');
    

  }]);

