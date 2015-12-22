'use strict';

/**
 * @ngdoc function
 * @name eracordUiApp.controller:UserCtrl
 * @description
 * # MainCtrl
 * Controller of the eracordUiApp
 */
angular.module('eracordUiApp.controller')
  .controller('UserCtrl',['$scope', 'Flash', 'Auth', '$location', '$cookieStore', function ($scope, Flash, Auth, $location, $cookieStore) {
    //var message = '<strong>You are not sign in!</strong> Please Sign in.';
    //Flash.create('success', message, 'alert-warning');

    $scope.multipleOrganisations = false;
    $scope.vm = {};
    $scope.vmorg = {};
    
    if(Auth.isAuthenticated()){
      Flash.create('success', 'You are already signed in', 'alert-success');
      $location.path('/');
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
        Flash.create('success', 'Unauthorized', 'alert-danger');
      });
      
      
    };
    
  }]);
