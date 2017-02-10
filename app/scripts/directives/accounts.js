'use strict';
var app;

app = angular.module('eracordUiApp.directives');

app.directive('vendorTransactions', function(Restangular) {
  return {
    restrict: 'AE',
    transclude: true,
    templateUrl: 'views/accounts/vendor_transactions.html',
    scope: {
      vendor: '='
    },
    controller: ['$scope', 'Restangular', 'Flash', '$location',  '$window', function(scope, Restangular, Flash, $location, $window){
      var jkci_classes = Restangular.one("jkci_classes", scope.classId);
    }]
  }
});
