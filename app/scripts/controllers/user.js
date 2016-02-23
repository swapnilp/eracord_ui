'use strict';

/**
 * @ngdoc function
 * @name eracordUiApp.controller:UserCtrl
 * @description
 * # MainCtrl
 * Controller of the eracordUiApp
 */
angular.module('eracordUiApp.controller')
  .controller('UserCtrl',['$scope', 'Flash', 'Auth', '$location', '$cookieStore', 'Restangular', function ($scope, Flash, Auth, $location, $cookieStore, Restangular) {
    //var message = '<strong>You are not sign in!</strong> Please Sign in.';
    //Flash.create('success', message, 'alert-warning');


    
    if($location.path() === '/user/sign_in') {
      $scope.multipleOrganisations = false;
      $scope.vm = {};
      $scope.vmorg = {};
      
      if(Auth.isAuthenticated()){

	if($cookieStore.get('currentUser') === undefined) {
	  $scope.currentUser = {};
	  Auth._currentUser = {};
	}else{
	  Flash.create('success', 'You are already signed in', 'alert-success');
	  $location.path('/');
	}
      }
      
      
      $scope.login = function() {
	if($scope.multipleOrganisations) {
	  var credentials = {
	    organisation_id: $scope.vmorg.organisation,
	    email: $scope.vmorg.username,
            password: $scope.vmorg.password
	  };
	} else {
	  var credentials = {
	    email: $scope.vm.username,
            password: $scope.vm.password
	  };
	}
	
	var config = {
          headers: {
            'X-HTTP-Method-Override': 'POST'
          }
	};
	
	Auth.login(credentials, config).then(function(user) {
	  if(user.success){
	    $scope.currentUser.email = user.email;
            $scope.currentUser.token = user.token;
	    $cookieStore.put('currentUser', user);
      	    Flash.create('success', 'Login Success', 'alert-success');
	    $location.path('/admin_desk');
	  } else {
	    $scope.multipleOrganisations = true;
	    $scope.organisations = user.organisations;
	    $scope.vmorg.username = user.email;
	  }
	}, function(error) {
	  $cookieStore.remove('currentUser');
          Flash.create('success', 'Please Enter valid credentials', 'alert-danger');
	  $scope.vm.password = "";
	});
	
	
      };
    }
    // end of sign in path

    if($location.path() === '/user/forgot_password') {

      $scope.vm = {};
      
      $scope.submitForgotPassword = function() {
	Restangular.all("users").customPOST({user: {email: $scope.vm.email}}, "reset_password",{}).then(function(data){
	  if(data) {
	    Flash.create('success', 'Reset password link sent to your email', 'alert-success');
	    $location.path("#/user/sign_in").replace();
	  } else {
	  }
	    
	})
      }
    }

    if($location.path() === '/user/change_password') {
      
      $scope.vm = {};

      $scope.updatePassword = function() {
	Restangular.all("").customPUT({user: $scope.vm}, "users").then(function(data){
	  if(data.success){
	    Flash.create('success', "Password has been changed", 'alert-success');
	    $location.path("/admin_desk").replace();
	  }else{
	    Flash.create('warning', data.message, 'alert-danger');
	    $scope.vm = {};
	  }
	});
      }
    }

    // end of change password 
    
  }]);
