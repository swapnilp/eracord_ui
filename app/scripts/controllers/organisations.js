'use strict';

/**
 * @ngdoc function
 * @name eracordUiApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the eracordUiApp
 */
angular.module('eracordUiApp.controller')
  .controller('OrganisationsCtrl',['$rootScope', '$scope', 'Flash', '$location', 'Auth', 'Restangular', '$routeParams', function ($rootScope, $scope, Flash, $location, Auth, Restangular, $routeParams) {

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
      
      base_organisation.customGET("users/"+$routeParams.user_id+"/get_roles").then(function(data){
	$scope.roles = data.data;
	$scope.user_id = $routeParams.user_id;
	$scope.requestLoading = false;
      });

      $scope.saveRoles = function(user_id){
	//$('.userRoles input:')
	var roles = $('.userRoles input:checked').map(
	  function () {return $(this).data('key');}).get().join(",");
	base_organisation.customPOST({roles: roles, user_id: $scope.user_id}, 'users/' + $scope.user_id + '/update_roles', {})
	  .then(function(data){
	    if(data.success){
	      $location.path('/manage_organisation').replace();
	    }
	  });
      };
    }

    if($location.path() === "/organisation/users/" + $routeParams.user_id + "/change_password") {
      base_organisation = Restangular.all("organisations");
      $scope.requestLoading = true;
      $scope.dataLoading = false;
      base_organisation.customGET("/users/"+ $routeParams.user_id + "/get_email").then(function(data){
	if(data.success){
	  $scope.email = data.email;
	}else{
	  $location.path('/manage_organisation');
	}
	$scope.requestLoading = false;
      });

      $scope.updateClarkPassword = function(){
	$scope.dataLoading = true;
	base_organisation.customPOST({clark: $scope.vm.user, email: $scope.email}, "/users/"+$routeParams.user_id+"/update_clark_password", {}).then(function(data){
	  if(data.success){
	    $location.path('/manage_organisation');
	  }else{
	    Flash.create('warning', "Please try again", 'alert-danger');
	  }
	  $scope.dataLoading = false;
	});
      };
    }

    if($location.path() === "/add_organisation_clark") {
      base_organisation = Restangular.all("organisations");
      $scope.registerUser = function(){
	$scope.vm.dataLoading = true;
	$scope.vm.user.role = 'clark';
	base_organisation.customPOST({clark: $scope.vm.user}, 'users/create_organisation_clark', {}).then(function(data){
	  if(data.success){
	    $location.path('/manage_organisation');
	  }else{
	    $scope.vm.dataLoading = false;
	    Flash.create('warning', data.message, 'alert-danger');
	  }
	});
      };
    }

    if($location.path() === "/organisations/teachers/new") {
      base_organisation = Restangular.all("organisations");
      $scope.vm = {};
      $scope.isNew = true;
      $scope.vm.user = {}
      $scope.vm.user.full_time = true;
      $scope.registerTeacher = function(){
      	$scope.vm.dataLoading = true;
      	$scope.vm.user.role = 'clark';
      	base_organisation.customPOST({teacher: $scope.vm.user}, 'teachers', {}).then(function(data){
      	  if(data.success){
      	    $location.path('/manage_organisation');
      	  }else{
      	    $scope.vm.dataLoading = false;
      	    Flash.create('warning', data.message, 'alert-danger');
      	  }
      	});
      };
    }

    if($location.path() === "/organisations/teachers/" + $routeParams.teacher_id + "/edit") {
      base_organisation = Restangular.all("organisations");
      $scope.vm = {};
      $scope.isNew = false;
      $scope.vm.user = {}
      $scope.vm.user.full_time = true;
      
      var getTeacher = function(){
	base_organisation.customGET('teachers/'+$routeParams.teacher_id+'/edit').then(function(data){
	  $scope.vm.user = data.teacher;
	})
      };
      
      
      $scope.registerTeacher = function(){
      	$scope.vm.dataLoading = true;
      	$scope.vm.user.role = 'clark';
      	base_organisation.customPUT({teacher: $scope.vm.user}, 'teachers/'+$routeParams.teacher_id, {}).then(function(data){
      	  if(data.success){
      	    $location.path('/manage_organisation');
      	  }else{
      	    $scope.vm.dataLoading = false;
      	    Flash.create('warning', data.message, 'alert-danger');
      	  }
      	});
      };
      
      getTeacher();
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
	    $location.path('/manage_organisation').replace();
	  } else {
	    Flash.create('warning', data.message, 'alert-danger');
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
	  Flash.create('warning', data.message, 'alert-danger');
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
	    Flash.create('warning', data.message, 'alert-danger');
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
	  Flash.create('warning', data.message, 'alert-danger');
	  $location.path('/manage_organisation').replace();
	}
	$scope.requestLoading = false;
      });

      $scope.updateFee = function() {
	base_organisation.one("courses", $routeParams.course_id).customPOST({fee: $scope.vm},"update_fee", {}).then(function(data) {
	  if(data.success) {
	    Flash.create('success', data.message, 'alert-success');
	    $location.path('/manage_organisation').replace();
	  } else {
	    Flash.create('warning', data.message, 'alert-danger');
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
	  Flash.create('warning', data.message, 'alert-danger');
	  $location.path('/manage_organisation').replace();
	}
	$scope.requestLoading = false;
      });

      $scope.updateFee = function() {
	base_organisation.one("classes", $routeParams.class_id).customPOST({fee: $scope.vm},"update_fee", {}).then(function(data) {
	  if(data.success) {
	    Flash.create('success', data.message, 'alert-success');
	    $location.path('/manage_organisation').replace();
	  } else {
	    Flash.create('warning', data.message, 'alert-danger');
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
      if($routeParams.standards_manage) {
	$scope.organisationStandardTab = true;
      }
    }
    //var exams = Restangular.all("exams").getList();
    //Flash.create('success', message, 'custom-class');
    

  }]);

