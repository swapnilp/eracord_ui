'use strict';
var app;

app = angular.module('eracordUiApp.directives');

app.directive('isRoleVisible', function(Restangular) {
  return {
    restrict: 'AE',
    scope: {
      roles: '=isRoleVisible'
    },
    controller: ['$scope', '$cookieStore', function(scope, $cookieStore){
      var roles = [];
      if ($cookieStore.get('currentUser') === null) {
	$location.path('/user/sign_in');
      }else{
	roles = $cookieStore.get('currentUser').roles.split(',');
      }

      scope.checkRole = function(){
	if(_.contains(roles, "admin")){
	  return 1;
	}
	return(_.intersection(roles, scope.roles).length);
      }
     }],
    link: function(scope, element, attrs) {
      if(scope.checkRole() == 0) {
	element.remove();
      }
    }
  }
});
