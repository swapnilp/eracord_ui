'use strict';

/**
 * @ngdoc function
 * @name eracordUiApp.controller:UserCtrl
 * @description
 * # MainCtrl
 * Controller of the eracordUiApp
 */
angular.module('eracordUiApp.controller')
  .controller('UserCtrl',['$scope', 'Flash', 'Auth', '$location', function ($scope, Flash, Auth, $location) {
    var message = '<strong>You are not sign in!</strong> Please Sign in.';
    Flash.create('success', message, 'alert-warning');
    
    if(Auth.isAuthenticated()){
      Flash.create('success', 'You are already signed in', 'alert-success');
      //$location.path('/');
    }


    $scope.login = function() {
      var credentials = {
	organisation_id: $scope.vm.organisation,
	email: $scope.vm.username,
        password: $scope.vm.password
      };
      var config = {
            headers: {
                'X-HTTP-Method-Override': 'POST'
            }
        };
      
      Auth.login(credentials, config).then(function(user) {
	$scope.currentUser.email = user.email
        //$scope.currentUser.token = user.token
      	Flash.create('success', 'Login Success', 'alert-success');
	$location.path('/');
      }, function(error) {
        Flash.create('success', 'Unauthorized', 'alert-danger');
      });
      
      
    };
    
  }]);
