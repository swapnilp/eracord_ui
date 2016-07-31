'use strict';

/**
 * @ngdoc function
 * @name eracordUiApp.controller:UserCtrl
 * @description
 * # MainCtrl
 * Controller of the eracordUiApp
 */
angular.module('eracordUiApp.controller')
  .controller('UserCtrl',['$rootScope', '$scope', 'Flash', 'Auth', '$location', '$cookieStore', 'Restangular', 'lazyFlash', function ($rootScope, $scope, Flash, Auth, $location, $cookieStore, Restangular, lazyFlash) {
    
    if($location.path() === '/user/sign_in') {
      $scope.multipleOrganisations = false;
      $scope.vm = {};
      $scope.vmorg = {};
      $scope.dataLoading = false;
      
      if(Auth.isAuthenticated()){

	if($cookieStore.get('currentUser') === undefined) {
	  $rootScope.currentUser = {};
	  Auth._currentUser = {};
	}else{
	  lazyFlash.success("You are already signed in");
	  $location.path('/');
	}
      }
      
      
      $scope.login = function() {
	$scope.dataLoading = true;
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
	  Flash.clear();
	  if(user.success){
	    $rootScope.currentUser.email = user.email;
	    $rootScope.currentUser.name = user.name;
            $rootScope.currentUser.token = user.token;
	    $cookieStore.put('currentUser', user);
	    lazyFlash.success("Login Success");
	    $location.path('/admin_desk');
	  } else {
	    $scope.multipleOrganisations = true;
	    $scope.organisations = user.organisations;
	    $scope.vmorg.username = user.email;
	  }
	  $scope.dataLoading = false;
	}, function(error) {
	  $cookieStore.remove('currentUser');
	  Flash.create('danger', 'Please Enter valid credentials', 0, {}, true);
	  $scope.vm.password = "";
	  $scope.dataLoading = false;
	});
	
	
      };
    }
    // end of sign in path

    if($location.path() === '/user/forgot_password') {

      $scope.vm = {};
      
      $scope.submitForgotPassword = function() {
	Restangular.all("users").customPOST({user: {email: $scope.vm.email}}, "reset_password",{}).then(function(data){
	  if(data) {
	    lazyFlash.success("Reset password link sent to your email");
	    $location.path("/user/sign_in").replace();
	  } else {
	  }
	    
	})
      }
    }

    if($location.path() === '/user/change_password') {
      
      $scope.vm = {};
      $scope.dataLoading = false;
      
      $scope.updatePassword = function() {
	$scope.dataLoading = true;
	Restangular.all("").customPUT({user: $scope.vm}, "users").then(function(data){
	  if(data.success){
	    lazyFlash.success("Password has been changed");
	    $location.path("/admin_desk").replace();
	  }else{
	    Flash.clear();
	    Flash.create('warning', data.message, 0, {}, true);
	    $scope.vm = {};
	    $scope.dataLoading = false;
	  }
	});
      }
    }

    // end of change password 
    
  }]);
