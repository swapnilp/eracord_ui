'use strict';

/**
 * @ngdoc function
 * @name eracordUiApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the eracordUiApp
 */

angular.module('eracordUiApp.controller')
  .controller('ContactCtrl',['$scope', 'Flash', 'Auth', '$location', 'Restangular', function ($scope, Flash, Auth, $location, Restangular) {
    
    $scope.reasons = ["Need Eracord Account", "Join You", "Fetching problem with eracord", "Not able to login", "Got Error", "Other"];

    $scope.vm = {};

    
    $scope.register = function() {
      var contact = Restangular.all('contacts');
      contact.post($scope.vm).then(function(data){
	if(data.success) { 
	  $location.path("/admin_desk").replace();
	}
      });
    };
    
    

  }
]);
