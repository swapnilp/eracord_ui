'use strict';

/**
 * @ngdoc function
 * @name eracordUiApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the eracordUiApp
 */
angular.module('eracordUiApp.controller')
  .controller('HelpCtrl',['$scope', '$uibModalInstance', 'Restangular', 'reason',
    function ($scope, $uibModalInstance, Restangular, reason) {

      $scope.questions = [];
      $scope.requestLoading = true;
      $scope.selected = "";
      $scope.addKeyVal = "";
      $scope.helpKeys = [reason];
      
      $scope.ok = function () {
	$uibModalInstance.close($scope.selected.item);
      };
      
      $scope.cancel = function () {
	$uibModalInstance.dismiss('cancel');
      };
      var questions = Restangular.all("questions");
      
      $scope.getQuestions = function(){
	$scope.requestLoading = true;
	$scope.selected = null;
	questions.customGET("", {keys: $scope.helpKeys.join(',')}).then(function(data){
	  if(data.success){
	    $scope.questions = data.questions;
	  }else{
	  }
	  $scope.requestLoading = false;
	});
      };

      $scope.getAnswer = function(question){
	$scope.requestLoading = true;
	$scope.selected = question;
	questions.customGET(""+question.id).then(function(data){
	  if(data.success){
	    $scope.question = data.question;
	    $scope.answers = data.answers;
	  }else{
	  }
	  $scope.requestLoading = false;
	});
      };

      $scope.addKey = function(val){
	$scope.helpKeys = $scope.helpKeys.concat([val]);
	this.addKeyVal = "";
	$scope.getQuestions();
      };

      $scope.removeKey = function(val){
	$scope.helpKeys = _.without($scope.helpKeys, val);
	$scope.getQuestions();
      };

      $scope.getQuestions();
    }]);
