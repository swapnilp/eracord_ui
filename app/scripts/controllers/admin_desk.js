'use strict';

/**
 * @ngdoc function
 * @name eracordUiApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the eracordUiApp
 */
angular.module('eracordUiApp.controller')
  .controller('AdminDeskCtrl',['$rootScope', '$scope', 'Flash', '$location', 'Auth', 'Restangular', function ($rootScope, $scope, Flash, $location, Auth, Restangular) {

    var message = '<strong>Well done!</strong> You successfully read this important alert message.';

    if(!Auth.isAuthenticated()){
      $location.path('/user/sign_in');
      return true;
    }

    $scope.load_desk_classes = function(){
      var jkci_classes = Restangular.all("jkci_classes");
      jkci_classes.getList().then(function(data){
	$scope.jkci_classes = data;
      })
    };

    $scope.load_unassigned_classes = function(){
      var unassigned_jkci_classes = Restangular.all("get_unassigned_classes");
      unassigned_jkci_classes.getList().then(function(data){
	$scope.us_jkci_classes = data;
      })
    };

    $scope.load_desk_classes();
    $scope.load_unassigned_classes();
    

  }]);

