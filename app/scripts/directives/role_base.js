'use strict';
var app;

app = angular.module('eracordUiApp.directives');

app.directive('isRoleVisible', function(Restangular) {
  return {
    restrict: 'AE',
    scope: {
      roles: '=isRoleVisible',
      email: '='
    },
    controller: ['$scope', '$cookieStore', function(scope, $cookieStore){
      var roles = [];

      
      var getRoles = function(){
	if ($cookieStore.get('currentUser') !== undefined) {
	  roles = $cookieStore.get('currentUser').roles.split(',');
	}else{
	  roles = [];
	}
      };

      scope.checkRole = function(){
	getRoles();
	if(_.contains(roles, "admin")){
	  return 1;
	}
	return(_.intersection(roles, scope.roles).length);
      }
     }],
    link: function(scope, element, attrs) {
      scope.$watch('email', function(){
	if(scope.checkRole() == 0) {
	  element.hide();
	} else {
	  element.show();
	}
      });
    }
  }
});
