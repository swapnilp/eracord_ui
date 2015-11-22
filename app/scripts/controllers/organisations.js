'use strict';

/**
 * @ngdoc function
 * @name eracordUiApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the eracordUiApp
 */
angular.module('eracordUiApp.controller')
  .controller('OrganisationsCtrl',['$rootScope', '$scope', 'Flash', '$location', 'Auth', 'Restangular', function ($rootScope, $scope, Flash, $location, Auth, Restangular) {

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
	    $location.path('/manage_organisation');
	  }
	})
      }
    }
    
    if(!Auth.isAuthenticated()){
      $location.path('/user/sign_in');
      return true;
    }
    //var exams = Restangular.all("exams").getList();
    //Flash.create('success', message, 'custom-class');
    

  }]);

