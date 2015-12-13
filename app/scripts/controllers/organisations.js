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

    var message = '<strong>Well done!</strong> You successfully read this important alert message.';
    

    
    if($location.path() === '/remaining_organisation_courses') {
      var cources = Restangular.all("/remaining_cources");
      cources.getList().then(function(organisation){
	$scope.cources = organisation;
      });
      
      $scope.saveList = function() {
	var a = _.where($scope.cources, {is_selected: true});
	//console.log(_.pluck(a, 'id'));
	Restangular.all("organisations").customGET('add_standards', {ids: _.pluck(a, 'id')}).then(function(data){
	  if(data.success){
	    $location.path('/manage_organisation').replace();
	  }
	});
      };
    }

    if($location.path() === "/organisations/users/"+$routeParams.user_id+"/manage_roles") {
      var base_organisation = Restangular.all("organisations");
      base_organisation.customGET("users/"+$routeParams.user_id+"/get_roles").then(function(data){
	$scope.roles = data.data;
	$scope.user_id = $routeParams.user_id;
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
      var base_organisation = Restangular.all("organisations");
      base_organisation.customGET("/users/"+ $routeParams.user_id + "/get_email").then(function(data){
	if(data.success){
	  $scope.email = data.email;
	}else{
	  $location.path('/manage_organisation');
	}
      });

      $scope.updateClarkPassword = function(){
	base_organisation.customPOST({clark: $scope.vm.user, email: $scope.email}, "/users/"+$routeParams.user_id+"/update_clark_password", {}).then(function(data){
	  if(data.success){
	    $location.path('/manage_organisation');
	  }else{
	    Flash.create('warning', "Please try again", 'alert-danger');
	  }
	});
      }
    }

    if($location.path() === "/add_organisation_clark") {
      var base_organisation = Restangular.all("organisations");
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
	
      }
    }

    if($location.path() === "/organisation/standards/" + $routeParams.standard_ids + "/launch_sub_organisation"){
      var base_organisation = Restangular.all("organisations");
      base_organisation.customGET('get_standards', {standards: $routeParams.standard_ids}).then(function(data){
	$scope.standards = data.organisations;
	$scope.name = _.map($scope.standards, function(obj){ return obj.name + '-' + obj.stream }).join(', ');
      });

      $scope.registerOrganisation = function(){
	var std_ids = _.pluck($scope.standards, 'id').join(',');
	base_organisation.customPOST({organisation: $scope.vm.org, standard_ids: std_ids}, "sub_organisation/launch_organisation", {}).then(function(data){
	  if(data.success) {
	    $location.path('/manage_organisation').replace();
	  }else {
	    Flash.create('warning', "Sub Organisation is not created", 'alert-danger');
	  }
	});
      }
    }
    
    if(!Auth.isAuthenticated()){
      $location.path('/user/sign_in');
      return true;
    }
    //var exams = Restangular.all("exams").getList();
    //Flash.create('success', message, 'custom-class');
    

  }]);

