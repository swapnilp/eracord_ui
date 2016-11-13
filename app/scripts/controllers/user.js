'use strict';

/**
 * @ngdoc function
 * @name eracordUiApp.controller:UserCtrl
 * @description
 * # MainCtrl
 * Controller of the eracordUiApp
 */
angular.module('eracordUiApp.controller')
  .controller('UserCtrl',['$rootScope', '$scope', 'Flash', 'Auth', '$location', '$cookieStore', 'Restangular', 'lazyFlash', '$timeout', '$window', function ($rootScope, $scope, Flash, Auth, $location, $cookieStore, Restangular, lazyFlash, $timeout, $window) {
    $scope.emailFormat = /^[a-z]+[a-z0-9._]+@[a-z]+\.[a-z.]{2,5}$/;
    
    if($location.path() === '/user/sign_in') {
      $scope.multipleOrganisations = false;
      $scope.vm = {};
      $scope.vmorg = {};
      $scope.dataLoading = false;
      $scope.invalidLogin = false;
      
      var reloadTimer;
      
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
	    $rootScope.currentUser.mobile = user.mobile;
	    $rootScope.logoUrl = user.logo_url;
	    $cookieStore.put('currentUser', user);
	    $timeout.cancel(reloadTimer);
	    if(user.verify_mobile) {
	      lazyFlash.success("Login Success");
	      $rootScope.disableNav = false;
	      $location.path('/admin_desk');
	    } else {
	      lazyFlash.warning("Login Success but you need to verify your mobile");
	      $location.path('/user/verify_mobile');
	    }
	  } else {
	    $scope.multipleOrganisations = true;
	    $scope.organisations = user.organisations;
	    $scope.vmorg.username = user.email;
	    $scope.vmorg.password = $scope.vm.password;
	    reloadTimer = $timeout(function(){$window.location.reload();}, 10000)
	  }
	  $scope.dataLoading = false;
	}, function(error) {
	  $cookieStore.remove('currentUser');
	  $scope.invalidLogin = true;
	  $scope.dataLoading = false;
	  
	});
	
	
      };
      $scope.changeText = function() {
	$scope.invalidLogin = false;
      }

      $scope.selectOrg = function(org) {
	_.map($scope.organisations, function(o){ o.selected = false; });
	org.selected = true;

	
      }
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

    if($location.path() === '/user/verify_mobile') {
      $scope.mobile = $rootScope.currentUser.mobile;
      $scope.vm = {user: {} };
      $scope.disableLink = false;
      var linkTimer;

      $scope.resendMobileToken = function() {
	if(!$scope.disableLink) {
	  Restangular.all("organisations").customPOST({}, "resend_mobile_token",{}).then(function(data){
	    if(data.success) {
	      $scope.disableLink = true;
	      linkTimer = $timeout(function(){
		$scope.disableLink = false;
		$timeout.cancel(linkTimer);
	      }, 50000)
	    }
	    else {
	      $scope.disableLink = false;
	    }
	  });
	}
      }
      
      $scope.verifyMobile = function() {
	Restangular.all("organisations").customPOST({user: $scope.vm.user}, "verify_user_mobile",{}).then(function(data){
	  if(data.success) {
	    $location.path('/admin_desk').replace();
	    $rootScope.disableNav = false;
	  } else {
	    Flash.clear();
	    Flash.create('danger', data.message, 0, {}, true);
	  }
	});
      }

      $scope.ignoreMobileVerification = function() {
	$location.path('/admin_desk').replace();
	$rootScope.disableNav = false;
      }
      
    }
    
  }]);
