'use strict';
var app;

app = angular.module('eracordUiApp.directives');

app.directive('isRoleVisible', function(Restangular) {
  return {
    restrict: 'AE',
    scope: {
      roles: '=isRoleVisible',
      email: '=',
      onlyRoot: "="
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
	  if(_.contains(scope.roles, "accountant")){
	    return(_.intersection(roles, ["accountant"]).length);
	  }
	  return 1;
	}
	return(_.intersection(roles, scope.roles).length);
      }
     }],
    link: function(scope, element, attrs) {
      scope.$watch('email', function(){
	console.log(scope.onlyRoot);
	if(scope.checkRole() == 0) {
	  element.hide();
	} else {
	  if(scope.onlyRoot === "false"){
	    element.hide();
	  }else {
	    element.show();
	  }
	}
      });
    }
  }
});
